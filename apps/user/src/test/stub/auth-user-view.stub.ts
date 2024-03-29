import { RefreshTokenValueObjectStub } from './refresh-token-value-object.stub';
import { AccessTokenValueObjectStub } from './access-token-value-object.stub';
import { UserStub } from '../stub/user-stub';

export const AuthUserViewStub = () => ({
  ...UserStub(),
  refreshToken: RefreshTokenValueObjectStub(),
  accessToken: AccessTokenValueObjectStub(),
});
