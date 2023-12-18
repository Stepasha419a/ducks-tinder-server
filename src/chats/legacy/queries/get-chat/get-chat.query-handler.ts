import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './get-chat.query';
import { FullChat } from 'chats/chats.interface';
import { UsersSelector } from 'users/users.selector';
import { ChatsSelector } from 'chats/chats.selector';
import { getDistanceFromLatLonInKm } from 'common/helpers';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler implements IQueryHandler<GetChatQuery> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetChatQuery): Promise<FullChat> {
    const { user, id } = query;

    const candidate = await this.prismaService.chat.findFirst({
      where: { id, users: { some: { id: user.id } } },
      select: { id: true },
    });
    if (!candidate) {
      throw new NotFoundException();
    }

    const messagesCount = await this.prismaService.message.count({
      where: { chatId: id },
    });

    const skipCount = messagesCount > 20 ? messagesCount - 20 : 0;

    const chat = await this.prismaService.chat.findUnique({
      where: { id },
      select: {
        id: true,
        messages: {
          skip: skipCount,
          take: 20,
          orderBy: { createdAt: 'asc' },
          select: ChatsSelector.selectMessage(),
        },
        users: {
          where: { id: { not: user.id } },
          select: UsersSelector.selectShortUser(),
        },
        blocked: true,
        blockedById: true,
      },
    });

    return {
      ...chat,
      users: chat.users.map((chatUser) => ({
        ...chatUser,
        distance: getDistanceFromLatLonInKm(
          user.place.latitude,
          user.place.longitude,
          chatUser.place.latitude,
          chatUser.place.longitude,
        ),
        place: { name: chatUser.place.name },
      })),
      messagesCount,
    };
  }
}
