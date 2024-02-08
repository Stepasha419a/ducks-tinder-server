import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from 'apps/user/src/domain/auth';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenValueObject: RefreshTokenValueObject;
}
