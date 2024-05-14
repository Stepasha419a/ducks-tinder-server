import { UserStub } from 'user-service/src/test/stub';

export const userDataStub = () => ({
  data: { user: UserStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
