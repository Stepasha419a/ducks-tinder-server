import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from 'apps/user/src/domain/token';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenValueObject: RefreshTokenValueObject;
}
