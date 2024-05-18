import databaseClient from 'src/infrastructure/database/test/database-client';

export async function prepareAfter(currentUserId, secondUserId) {
  await databaseClient.$transaction([
    databaseClient.message.deleteMany({
      where: { userId: { in: [currentUserId, secondUserId] } },
    }),
    databaseClient.chat.deleteMany({
      where: {
        users: { some: { userId: { in: [currentUserId, secondUserId] } } },
      },
    }),
    databaseClient.place.deleteMany({
      where: { id: { in: [currentUserId, secondUserId] } },
    }),
    databaseClient.user.deleteMany({
      where: { id: { in: [currentUserId, secondUserId] } },
    }),
  ]);
}
