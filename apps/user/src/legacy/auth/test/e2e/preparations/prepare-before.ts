import { authUserStub } from 'apps/user/src/legacy/auth/test/stubs';
import prismaClient from '@app/common/database/test/database-client/database-client';
import { UserStub } from 'apps/user/src/test/stub';

export async function prepareBefore() {
  await prismaClient.user.create({
    data: {
      id: authUserStub().id,
      email: authUserStub().email,
      name: UserStub().name,
      // password which is equal for bcrypt compare
      password: '$2a$07$HQtmk3r9h1Gg1YiOLO67duUs3GPDg5.KKCtPSm/152gqIALiRvs6q',
    },
  });
}
