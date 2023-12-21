import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { PrismaService } from 'prisma/prisma.service';
import { ChatAggregate } from 'chats/domain/chat.aggregate';
import { PaginationDto } from 'libs/shared/dto';
import {
  ChatMessage,
  MessageAggregate,
  PaginationChatAggregate,
} from 'chats/domain';
import { ChatsSelector } from 'chats/chats.selector';

@Injectable()
export class ChatAdapter implements ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(chat: ChatAggregate): Promise<ChatAggregate> {
    const existingChat = await this.findOne(chat.id);
    if (existingChat) {
      const dataToUpdate =
        (await existingChat.getPrimitiveFields()) as Prisma.Without<
          Prisma.UserUpdateInput,
          Prisma.UserUncheckedUpdateInput
        > &
          Prisma.UserUncheckedUpdateInput;

      const updatedChat = await this.prismaService.user.update({
        where: { id: existingChat.id },
        data: dataToUpdate,
      });

      return ChatAggregate.create(updatedChat);
    }

    const saved = await this.prismaService.chat.create({
      data: {
        id: chat.id,
        blocked: chat.blocked,
        blockedById: chat.blockedById,
      },
    });

    return ChatAggregate.create(saved);
  }

  async findOne(id: string): Promise<ChatAggregate | null> {
    const existingChat = await this.prismaService.chat
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
    const existingChat = await this.prismaService.chat
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
    const existingChat = await this.prismaService.chat
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
  ): Promise<PaginationChatAggregate[]> {
    const chats = await this.prismaService.chat.findMany({
      where: { users: { some: { id: userId } } },
      take: dto.take,
      skip: dto.skip,
      select: {
        id: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: ChatsSelector.selectMessage(),
        },
        users: {
          where: { id: { not: userId } },
          select: { name: true, pictures: { take: 1 } },
          orderBy: { pictures: { _count: 'desc' } },
        },
        blocked: true,
        blockedById: true,
      },
    });

    const paginationChatAggregates = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = chat.messages[0]
          ? await MessageAggregate.create({
              ...chat.messages[0],
              createdAt: chat.messages[0].createdAt.toISOString(),
              updatedAt: chat.messages[0].updatedAt.toISOString(),
            }).getChatMessage()
          : null;

        const avatar: string | null =
          chat.users[0]?.pictures?.[0]?.name || null;

        return PaginationChatAggregate.create({
          id: chat.id,
          avatar,
          name: chat.users[0].name,
          blocked: chat.blocked,
          blockedById: chat.blockedById,
          lastMessage,
        });
      }),
    );

    return paginationChatAggregates;
  }

  async findMessages(
    chatId: string,
    dto: PaginationDto,
  ): Promise<ChatMessage[]> {
    const messages = await this.prismaService.message.findMany({
      where: {
        chatId,
      },
      select: ChatsSelector.selectMessage(),
      orderBy: { createdAt: 'asc' },
      skip: dto.skip,
      take: dto.take,
    });

    return Promise.all(
      messages.map((message) =>
        MessageAggregate.create({
          ...message,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        }).getChatMessage(),
      ),
    );
  }

  async findMessagesCount(chatId: string): Promise<number> {
    const messagesCount = await this.prismaService.message.count({
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

    await this.prismaService.chat.update({
      where: { id: chatId },
      data: { users: { connect: { id: userId } } },
    });

    return ChatAggregate.create(existingChat);
  }

  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
