import { AccessTokenValueObject, RefreshTokenValueObject } from 'user/domain';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenValueObject: RefreshTokenValueObject;
}
