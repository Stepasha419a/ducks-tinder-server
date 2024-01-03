import { AccessTokenObjectValue, RefreshTokenAggregate } from 'user/domain';

export interface GenerateTokensView {
  accessTokenAggregate: AccessTokenObjectValue;
  refreshTokenAggregate: RefreshTokenAggregate;
}
