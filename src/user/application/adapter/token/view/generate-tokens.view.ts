import { AccessTokenValueObject, RefreshTokenValueObject } from 'user/domain';

export interface GenerateTokensView {
  accessTokenAggregate: AccessTokenValueObject;
  refreshTokenAggregate: RefreshTokenValueObject;
}
