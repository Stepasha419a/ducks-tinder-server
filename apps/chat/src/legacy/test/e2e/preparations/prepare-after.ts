import prismaClient from '@app/common/database/test/database-client';

export async function prepareAfter(currentUserId, secondUserId) {
  await prismaClient.$transaction([
    prismaClient.message.deleteMany({
      where: { userId: { in: [currentUserId, secondUserId] } },
    }),
    prismaClient.chat.deleteMany({
      where: {
        users: { some: { userId: { in: [currentUserId, secondUserId] } } },
      },
    }),
    prismaClient.place.deleteMany({
      where: { id: { in: [currentUserId, secondUserId] } },
    }),
    prismaClient.user.deleteMany({
      where: { id: { in: [currentUserId, secondUserId] } },
    }),
  ]);
}
