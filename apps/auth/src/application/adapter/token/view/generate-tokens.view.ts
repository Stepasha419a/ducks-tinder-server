import { AccessTokenValueObject, RefreshTokenValueObject } from 'auth/domain';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenValueObject: RefreshTokenValueObject;
}
