import { RefreshTokenEntityStub } from './refresh-token-entity.stub';
import { AccessTokenValueObjectStub } from './access-token-value-object.stub';
import { UserStub } from './user-stub';

export const AuthUserViewStub = () => ({
  ...UserStub(),
  refreshToken: RefreshTokenEntityStub(),
  accessToken: AccessTokenValueObjectStub(),
});
