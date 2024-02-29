import { Prisma } from '@prisma/client';

export class ChatSelector {
  static selectMessage() {
    return {
      id: true,
      text: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      chatId: true,
      replied: {
        select: {
          id: true,
          text: true,
          userId: true,
        },
      },
      user: {
        select: {
          name: true,
          pictures: { take: 1, orderBy: { order: 'asc' as Prisma.SortOrder } },
        },
      },
    };
  }
}
