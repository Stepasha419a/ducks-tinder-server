import databaseClient from 'src/infrastructure/database/test/database-client';

export async function prepareAfter(currentUserId, secondUserId) {
  await databaseClient.$transaction([
    databaseClient.picture.deleteMany({
      where: { user: { id: { in: [currentUserId, secondUserId] } } },
    }),
    databaseClient.checkedUsers.deleteMany({
      where: {
        OR: [{ checkedId: currentUserId }, { checkedId: secondUserId }],
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
