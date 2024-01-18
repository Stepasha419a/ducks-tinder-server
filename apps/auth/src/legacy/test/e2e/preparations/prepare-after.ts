import { authUserStub } from 'apps/auth/src/legacy/test/stubs';
import prismaClient from '@app/common/prisma/test/prisma-client/prisma-client';

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
