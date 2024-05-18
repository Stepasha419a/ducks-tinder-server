import { authUserStub } from 'src/legacy/auth/test/stubs';
import prismaClient from '@app/common/database/test/database-client/database-client';

export async function prepareAfter() {
  await prismaClient.$transaction([
    prismaClient.token.deleteMany({
      where: {
        user: { email: { in: [authUserStub().email, '789@gmail.com'] } },
      },
    }),
    prismaClient.user.deleteMany({
      where: { email: { in: [authUserStub().email, '789@gmail.com'] } },
    }),
  ]);
}
