import databaseClient from 'src/infrastructure/database/test/database-client';
import { authUserStub } from 'src/legacy/auth/test/stubs';
import { UserStub } from 'src/test/stub';

export async function prepareBefore() {
  await databaseClient.user.create({
    data: {
      id: authUserStub().id,
      email: authUserStub().email,
      name: UserStub().name,
      // password which is equal for bcrypt compare
      password: '$2a$07$HQtmk3r9h1Gg1YiOLO67duUs3GPDg5.KKCtPSm/152gqIALiRvs6q',
    },
  });
}
