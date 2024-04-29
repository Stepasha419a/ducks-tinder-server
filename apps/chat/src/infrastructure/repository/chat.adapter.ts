import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../../domain/repository/chat.repository';
import { DatabaseService } from '@app/common/database';
import { ChatAggregate } from 'apps/chat/src/domain';
import { PaginationDto } from '@app/common/shared/dto';
import { MessageAggregate } from 'apps/chat/src/domain';
import { ChatSelector } from './chat.selector';
import { ChatPaginationEntity, ChatVisitEntity } from '../../domain/entity';
import { RepliedMessage } from '../../domain/message/message.interface';

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

    await this.databaseService.chat.update({
      where: { id: message.chatId },
      data: { updatedAt: new Date().toISOString() },
    });

    return this.getMessageAggregate(saved);
  }

  async saveChatVisit(
    chatVisit: ChatVisitEntity,
  ): Promise<ChatVisitEntity | null> {
    const existingChatVisit = await this.findChatVisit(
      chatVisit.userId,
      chatVisit.chatId,
    );

    if (existingChatVisit) {
      const savedChatVisit = await this.databaseService.usersOnChats.update({
        where: {
          userId_chatId: { chatId: chatVisit.chatId, userId: chatVisit.userId },
        },
        data: {
          lastSeenAt: chatVisit.lastSeenAt,
          newMessagesCount: chatVisit.newMessagesCount,
        },
      });

      return this.getChatVisitEntity(savedChatVisit);
    }

    const savedChatVisit = await this.databaseService.usersOnChats.create({
      data: {
        chatId: chatVisit.chatId,
        userId: chatVisit.userId,
        lastSeenAt: chatVisit.lastSeenAt,
        newMessagesCount: chatVisit.newMessagesCount,
      },
    });

    return this.getChatVisitEntity(savedChatVisit);
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
        where: { users: { every: { userId: { in: userIds } } } },
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
        where: { id, users: { some: { userId } } },
      })
      .catch(() => {
        return null;
      });

    if (!existingChat) {
      return null;
    }

    return this.getChatAggregate(existingChat);
  }

  async findOnePaginationHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatPaginationEntity | null> {
    const chat = await this.databaseService.chat
      .findFirst({
        where: { id, users: { some: { userId } } },
        select: {
          id: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: ChatSelector.selectMessage(),
          },
          users: {
            take: 2,
            where: { OR: [{ userId }, { NOT: { userId } }] },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  pictures: { take: 1, orderBy: { order: 'asc' } },
                },
              },
              lastSeenAt: true,
              newMessagesCount: true,
            },
            orderBy: { user: { pictures: { _count: 'desc' } } },
          },
          blocked: true,
          blockedById: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(() => {
        return null;
      });

    if (!chat) {
      return null;
    }

    const lastMessage = chat.messages[0]
      ? this.getMessageAggregate(chat.messages[0])
      : null;

    const member = chat.users.find((item) => item.user.id !== userId)?.user;
    const user = chat.users.find((item) => item.user.id === userId);

    const pictureName = member?.pictures?.[0]?.name;
    const memberId = member.id;
    const avatar = pictureName ?? null;

    const name = member.name;

    const newMessagesCount = user.newMessagesCount;

    return this.getChatPaginationEntity({
      id: chat.id,
      memberId,
      avatar,
      name,
      lastMessage,
      blocked: chat.blocked,
      blockedById: chat.blockedById,
      newMessagesCount,
      lastSeenAt: user.lastSeenAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  }

  async findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationEntity[]> {
    const chats = await this.databaseService.chat.findMany({
      where: {
        users: {
          some: { userId },
        },
      },
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
          take: 2,
          where: { OR: [{ userId }, { NOT: { userId } }] },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                pictures: { take: 1, orderBy: { order: 'asc' } },
              },
            },
            lastSeenAt: true,
            newMessagesCount: true,
          },
          orderBy: { user: { pictures: { _count: 'desc' } } },
        },
        blocked: true,
        blockedById: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const paginationChatAggregates = chats.map((chat) => {
      const lastMessage = chat.messages[0]
        ? this.getMessageAggregate(chat.messages[0])
        : null;

      const member = chat.users.find((item) => item.user.id !== userId)?.user;
      const user = chat.users.find((item) => item.user.id === userId);

      const pictureName = member?.pictures?.[0]?.name;
      const memberId = member.id;
      const avatar = pictureName ?? null;

      const name = member.name;

      const newMessagesCount = user.newMessagesCount;

      return this.getChatPaginationEntity({
        id: chat.id,
        memberId,
        avatar,
        name,
        lastMessage,
        blocked: chat.blocked,
        blockedById: chat.blockedById,
        newMessagesCount,
        lastSeenAt: user.lastSeenAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      });
    });

    return paginationChatAggregates;
  }

  async findChatUserIds(chatId: string): Promise<string[]> {
    const users = await this.databaseService.user.findMany({
      where: {
        chats: {
          some: { chatId },
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
  ): Promise<ChatVisitEntity | null> {
    const chatVisit = await this.databaseService.usersOnChats.findUnique({
      where: {
        userId_chatId: { chatId, userId },
      },
    });

    if (!chatVisit) {
      return null;
    }

    return this.getChatVisitEntity(chatVisit);
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

  findNewMessagesCount(userId: string): Promise<number> {
    return this.databaseService.chat.count({
      where: { users: { some: { userId, newMessagesCount: { gt: 0 } } } },
    });
  }

  async findUsersNewMessagesCount(
    chatId: string,
    userIds: string[],
  ): Promise<Record<string, number>> {
    const query = `select users.id, count(*) from messages 
    inner join chats on chats.id = messages."chatId"  
    inner join "users-on-chats" on "users-on-chats"."chatId" = chats.id
    inner join users on users.id = "users-on-chats"."userId"
    where messages."chatId" = '${chatId}'
    and messages."createdAt" > "users-on-chats"."lastSeenAt"
    and messages."userId" != users.id
    and users.id in ('${userIds.join("', '")}')
    group by users.id`;

    const queryResult = (await this.databaseService
      .$queryRaw`${Prisma.raw(query)}`) as Array<{ id: string; count: number }>;

    const usersNewMessagesCount: Record<string, number> = queryResult.reduce(
      (obj, pair) => {
        return Object.assign(obj, { [pair.id]: Number(pair.count) });
      },
      {},
    );

    return usersNewMessagesCount;
  }

  async connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null> {
    const existingChat = await this.findOneHavingMember(chatId, userId);

    if (!existingChat) {
      return null;
    }

    await this.databaseService.chat.update({
      where: { id: chatId },
      data: { users: { connect: { userId_chatId: { chatId, userId } } } },
    });

    return existingChat;
  }

  async increaseChatVisits(
    chatId: string,
    exceptUserId: string,
    increaseValue: number,
  ) {
    await this.databaseService.usersOnChats.updateMany({
      where: { userId: { not: exceptUserId }, chatId },
      data: { newMessagesCount: { increment: increaseValue } },
    });
  }

  async delete(id: string): Promise<boolean> {
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
    const avatar = pictureName ?? null;

    return MessageAggregate.create({
      ...message,
      replied: this.getRepliedMessage(message.replied),
      name: message.user.name,
      avatar,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    });
  }

  private getChatVisitEntity(chatVisit): ChatVisitEntity {
    return ChatVisitEntity.create({
      ...chatVisit,
      createdAt: chatVisit.createdAt.toISOString(),
      lastSeenAt: chatVisit.lastSeenAt.toISOString(),
    });
  }

  private getRepliedMessage(repliedMessage): RepliedMessage {
    if (!repliedMessage) {
      return null;
    }

    const name = repliedMessage?.user.name;

    return {
      id: repliedMessage.id,
      text: repliedMessage.text,
      userId: repliedMessage.userId,
      name,
    };
  }

  private getChatPaginationEntity(chat): ChatPaginationEntity {
    return ChatPaginationEntity.create({
      ...chat,
      lastSeenAt: chat.lastSeenAt.toISOString(),
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    });
  }

  private getChatAggregate(chat): ChatAggregate {
    return ChatAggregate.create({
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    });
  }
}
