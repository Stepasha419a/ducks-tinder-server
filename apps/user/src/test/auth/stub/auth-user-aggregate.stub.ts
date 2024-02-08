import { RefreshTokenValueObjectStub } from './refresh-token-value-object.stub';
import { AccessTokenValueObjectStub } from './access-token-value-object.stub';
import { UserStub } from 'apps/user/src/test/user/stub/user-stub';

export const AuthUserAggregateStub = () => ({
  ...UserStub(),
  refreshToken: RefreshTokenValueObjectStub(),
  accessToken: AccessTokenValueObjectStub(),
});
