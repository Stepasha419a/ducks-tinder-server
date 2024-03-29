import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../../domain/repository/chat.repository';
import { DatabaseService } from '@app/common/database';
import { ChatAggregate } from 'apps/chat/src/domain';
import { PaginationDto } from '@app/common/shared/dto';
import { MessageAggregate } from 'apps/chat/src/domain';
import { ChatSelector } from './chat.selector';
import {
  ChatVisitValueObject,
  ChatPaginationValueObject,
  RepliedMessageValueObject,
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

      return this.getChatAggregate(updatedChat);
    }

    const saved = await this.databaseService.chat.create({
      data: {
        id: chat.id,
        blocked: chat.blocked,
        blockedById: chat.blockedById,
        createdAt: chat.createdAt,
      },
    });

    return this.getChatAggregate(saved);
  }

  async saveMessage(message: MessageAggregate): Promise<MessageAggregate> {
    const existingMessage = await this.findMessage(message.id);
    if (existingMessage) {
      const updatedMessage = await this.databaseService.message.update({
        where: { id: existingMessage.id },
        data: {
          text: message.text,
          updatedAt: new Date().toISOString(),
        },
        select: ChatSelector.selectMessage(),
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
      select: ChatSelector.selectMessage(),
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

    return this.getChatAggregate(existingChat);
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

    return this.getChatAggregate(existingChat);
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

    return this.getChatAggregate(existingChat);
  }

  async findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationValueObject[]> {
    // prisma doesn't support ordering many relations => i find messages by distinct chatId and ordering them
    // then find chats by this messages chatId and add empty chats if it's not enough for dto.take

    const messagesChatId = await this.databaseService.message.findMany({
      where: {
        chat: {
          users: {
            some: {
              id: {
                equals: userId,
              },
            },
          },
        },
      },
      distinct: 'chatId',
      select: {
        chatId: true,
      },
      take: dto.take,
      skip: dto.skip,
      orderBy: { createdAt: 'desc' },
    });

    const chatIds = messagesChatId.map((obj) => obj.chatId);

    let chats = await this.databaseService.chat.findMany({
      where: {
        id: {
          in: chatIds,
        },
      },
      select: {
        id: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: ChatSelector.selectMessage(),
        },
        users: {
          take: 1,
          where: { id: { not: userId } },
          select: {
            id: true,
            name: true,
            pictures: { take: 1, orderBy: { order: 'asc' } },
          },
          orderBy: { pictures: { _count: 'desc' } },
        },
        chatVisits: { where: { userId } },
        blocked: true,
        blockedById: true,
        createdAt: true,
      },
    });

    chats.sort(
      (a, b) =>
        +new Date(b.messages[0].createdAt) - +new Date(a.messages[0].createdAt),
    );

    if (chats.length < dto.take) {
      const emptyChats = await this.databaseService.chat.findMany({
        where: {
          users: { some: { id: { equals: userId } } },
          messages: { none: {} },
        },
        take: dto.take - chats.length,
        select: {
          id: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: ChatSelector.selectMessage(),
          },
          users: {
            take: 1,
            where: { id: { not: userId } },
            select: {
              id: true,
              name: true,
              pictures: { take: 1, orderBy: { order: 'asc' } },
            },
            orderBy: { pictures: { _count: 'desc' } },
          },
          chatVisits: { where: { userId } },
          blocked: true,
          blockedById: true,
          createdAt: true,
        },
      });

      chats = chats.concat(emptyChats);
    }

    const paginationChatAggregates = chats.map((chat) => {
      const lastMessage = chat.messages[0]
        ? this.getMessageAggregate(chat.messages[0])
        : null;

      const chatVisit = chat.chatVisits[0]
        ? this.getChatVisitValueObject(chat.chatVisits[0])
        : null;

      const pictureName = chat.users[0]?.pictures?.[0]?.name;
      const memberId = chat.users[0].id;
      const avatar = pictureName ? `${chat.users[0].id}/${pictureName}` : null;

      const name = chat.users[0].name;

      return ChatPaginationValueObject.create({
        id: chat.id,
        memberId,
        avatar,
        name,
        chatVisit,
        lastMessage,
        blocked: chat.blocked,
        blockedById: chat.blockedById,
        createdAt: chat.createdAt.toISOString(),
      });
    });

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
      select: ChatSelector.selectMessage(),
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
      orderBy: { createdAt: 'desc' },
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

    return existingChat;
  }

  async delete(id: string): Promise<boolean> {
    await this.databaseService.chatVisit.deleteMany({
      where: { chatId: id },
    });

    await this.databaseService.message.deleteMany({ where: { chatId: id } });

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
    const pictureName = message.user.pictures[0]?.name;
    const avatar = pictureName ? `${message.userId}/${pictureName}` : null;

    return MessageAggregate.create({
      ...message,
      replied: this.getRepliedMessageValueObject(message.replied),
      name: message.user.name,
      avatar,
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

  private getRepliedMessageValueObject(
    repliedMessage,
  ): RepliedMessageValueObject {
    if (!repliedMessage) {
      return null;
    }

    const name = repliedMessage?.user.name;

    return RepliedMessageValueObject.create({
      ...repliedMessage,
      name,
    });
  }

  private getChatAggregate(chat): ChatAggregate {
    return ChatAggregate.create({
      ...chat,
      createdAt: chat.createdAt.toISOString(),
    });
  }
}
