import { UserStub } from 'src/test/stub';

export const userDataStub = () => ({
  data: { user: UserStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
