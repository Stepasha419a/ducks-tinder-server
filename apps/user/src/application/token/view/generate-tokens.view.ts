import {
  AccessTokenValueObject,
  RefreshTokenEntity,
} from 'apps/user/src/domain/token';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenEntity: RefreshTokenEntity;
}
