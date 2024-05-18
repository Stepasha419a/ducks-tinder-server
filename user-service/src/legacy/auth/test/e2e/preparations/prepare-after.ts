import databaseClient from 'src/infrastructure/database/test/database-client';
import { authUserStub } from 'src/legacy/auth/test/stubs';

export async function prepareAfter() {
  await databaseClient.$transaction([
    databaseClient.token.deleteMany({
      where: {
        user: { email: { in: [authUserStub().email, '789@gmail.com'] } },
      },
    }),
    databaseClient.user.deleteMany({
      where: { email: { in: [authUserStub().email, '789@gmail.com'] } },
    }),
  ]);
}
