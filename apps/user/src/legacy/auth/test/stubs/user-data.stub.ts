import { UserStub } from 'apps/user/src/test/user/stub';

export const userDataStub = () => ({
  data: { user: UserStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
