import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../../domain/repository/chat.repository';
import { DatabaseService } from '@app/common/database';
import { ChatAggregate } from 'apps/chat/src/domain/chat.aggregate';
import { PaginationDto } from '@app/common/shared/dto';
import { MessageAggregate } from 'apps/chat/src/domain';
import { ChatSelector } from './chat.selector';
import {
  ChatVisitValueObject,
  ChatPaginationValueObject,
} from 'apps/chat/src/domain/value-object';

@Injectable()
export class ChatAdapter implements ChatRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async save(chat: ChatAggregate): Promise<ChatAggregate> {
    const existingChat = await this.findOne(chat.id);
    if (existingChat) {
      const dataToUpdate = (await chat.getPrimitiveFields()) as Prisma.Without<
        Prisma.ChatUpdateInput,
        Prisma.ChatUncheckedUpdateInput
      > &
        Prisma.ChatUncheckedUpdateInput;

      const updatedChat = await this.databaseService.chat.update({
        where: { id: existingChat.id },
        data: dataToUpdate,
      });

      return ChatAggregate.create(updatedChat);
    }

    const saved = await this.databaseService.chat.create({
      data: {
        id: chat.id,
        blocked: chat.blocked,
        blockedById: chat.blockedById,
      },
    });

    return ChatAggregate.create(saved);
  }

  async saveMessage(message: MessageAggregate): Promise<MessageAggregate> {
    const existingMessage = await this.findMessage(message.id);
    if (existingMessage) {
      const updatedMessage = await this.databaseService.message.update({
        where: { id: existingMessage.id },
        data: {
          text: message.text,
        },
      });

      return this.getMessageAggregate(updatedMessage);
    }

    const saved = await this.databaseService.message.create({
      data: {
        id: message.id,
        text: message.text,
        chatId: message.chatId,
        repliedId: message.replied?.id,
        userId: message.userId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
    });

    return this.getMessageAggregate(saved);
  }

  async saveChatVisit(
    chatVisit: ChatVisitValueObject,
  ): Promise<ChatVisitValueObject> {
    const existingChatVisit = await this.findChatVisit(
      chatVisit.userId,
      chatVisit.chatId,
    );
    if (existingChatVisit) {
      const updatedChatVisit = await this.databaseService.chatVisit.update({
        where: {
          userId_chatId: { chatId: chatVisit.chatId, userId: chatVisit.userId },
        },
        data: {
          lastSeen: chatVisit.lastSeen,
        },
      });

      return this.getChatVisitValueObject(updatedChatVisit);
    }

    const saved = await this.databaseService.chatVisit.create({
      data: chatVisit,
    });

    return this.getChatVisitValueObject(saved);
  }

  async findOne(id: string): Promise<ChatAggregate | null> {
    const existingChat = await this.databaseService.chat
      .findUnique({
        where: { id },
      })
      .catch(() => {
        return null;
      });

    if (!existingChat) {
      return null;
    }

    return ChatAggregate.create(existingChat);
  }

  async findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null> {
    const existingChat = await this.databaseService.chat
      .findFirst({
        where: { users: { every: { id: { in: userIds } } } },
      })
      .catch(() => {
        return null;
      });

    if (!existingChat) {
      return null;
    }

    return ChatAggregate.create(existingChat);
  }

  async findOneHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatAggregate | null> {
    const existingChat = await this.databaseService.chat
      .findFirst({
        where: { id, users: { some: { id: userId } } },
      })
      .catch(() => {
        return null;
      });

    if (!existingChat) {
      return null;
    }

    return ChatAggregate.create(existingChat);
  }

  async findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationValueObject[]> {
    const chats = await this.databaseService.chat.findMany({
      where: { users: { some: { id: userId } } },
      take: dto.take,
      skip: dto.skip,
      select: {
        id: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: ChatSelector.selectMessage(),
        },
        users: {
          where: { id: { not: userId } },
          select: { name: true, pictures: { take: 1 } },
          orderBy: { pictures: { _count: 'desc' } },
        },
        chatVisits: { where: { userId } },
        blocked: true,
        blockedById: true,
      },
    });

    const paginationChatAggregates = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = chat.messages[0]
          ? this.getMessageAggregate(chat.messages[0])
          : null;

        const chatVisit = chat.chatVisits[0]
          ? this.getChatVisitValueObject(chat.chatVisits[0])
          : null;

        const avatar: string | null =
          chat.users[0]?.pictures?.[0]?.name || null;

        return ChatPaginationValueObject.create({
          id: chat.id,
          avatar,
          name: chat.users[0].name,
          blocked: chat.blocked,
          blockedById: chat.blockedById,
          chatVisit,
          lastMessage,
        });
      }),
    );

    return paginationChatAggregates;
  }

  async findChatUserIds(chatId: string): Promise<string[]> {
    const users = await this.databaseService.user.findMany({
      where: {
        chats: {
          some: { id: chatId },
        },
      },
      select: { id: true },
    });

    return users.map((user) => user.id);
  }

  async findMessage(messageId: string): Promise<MessageAggregate | null> {
    const message = await this.databaseService.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return null;
    }

    return this.getMessageAggregate(message);
  }

  async findChatVisit(
    userId: string,
    chatId: string,
  ): Promise<ChatVisitValueObject | null> {
    const chatVisit = await this.databaseService.chatVisit.findUnique({
      where: {
        userId_chatId: { chatId, userId },
      },
    });

    if (!chatVisit) {
      return null;
    }

    return this.getChatVisitValueObject(chatVisit);
  }

  async findMessages(
    chatId: string,
    dto: PaginationDto,
  ): Promise<MessageAggregate[]> {
    const messages = await this.databaseService.message.findMany({
      where: {
        chatId,
      },
      select: ChatSelector.selectMessage(),
      orderBy: { createdAt: 'asc' },
      skip: dto.skip,
      take: dto.take,
    });

    return messages.map((message) => this.getMessageAggregate(message));
  }

  async findMessagesCount(chatId: string): Promise<number> {
    const messagesCount = await this.databaseService.message.count({
      where: { chatId: chatId },
    });

    return messagesCount;
  }

  async connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null> {
    const existingChat = await this.findOne(chatId);

    if (!existingChat) {
      return null;
    }

    await this.databaseService.chat.update({
      where: { id: chatId },
      data: { users: { connect: { id: userId } } },
    });

    return ChatAggregate.create(existingChat);
  }

  async delete(id: string): Promise<boolean> {
    await this.databaseService.chatVisit.deleteMany({
      where: { chatId: id },
    });
    const deletedChat = await this.databaseService.chat.delete({
      where: { id },
    });

    return Boolean(deletedChat);
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const deletedMessage = await this.databaseService.message.delete({
      where: { id: messageId },
    });

    return Boolean(deletedMessage);
  }

  private getMessageAggregate(message): MessageAggregate {
    return MessageAggregate.create({
      ...message,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    });
  }

  private getChatVisitValueObject(chatVisit): ChatVisitValueObject {
    return ChatVisitValueObject.create({
      ...chatVisit,
      lastSeen: chatVisit.lastSeen.toISOString(),
    });
  }
}
