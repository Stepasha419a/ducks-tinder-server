import { UserStub } from 'apps/user/src/test/stub';

export const userDataStub = () => ({
  data: { user: UserStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
