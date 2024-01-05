import { RefreshTokenValueObjectStub } from './refresh-token-value-object.stub';
import { AccessTokenValueObjectStub } from './access-token-value-object.stub';
import { UserStub } from './user-stub';

export const AuthUserAggregateStub = () => ({
  user: UserStub(),
  refreshToken: RefreshTokenValueObjectStub(),
  accessToken: AccessTokenValueObjectStub(),
});
