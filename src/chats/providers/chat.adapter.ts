import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { PrismaService } from 'prisma/prisma.service';
import { ChatAggregate } from 'chats/domain/chat.aggregate';

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
