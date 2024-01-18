import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from 'apps/auth/src/domain';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenValueObject: RefreshTokenValueObject;
}
