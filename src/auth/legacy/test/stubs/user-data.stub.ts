import { userDtoStub } from 'users/test/stubs';

export const userDataStub = () => ({
  data: { user: userDtoStub(), accessToken: 'access-token' },
  refreshToken: 'refresh-token',
});
