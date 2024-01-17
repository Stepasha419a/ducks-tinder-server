import { UserStub } from 'user/test/stub';

export const userDataStub = () => ({
  data: { user: UserStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
