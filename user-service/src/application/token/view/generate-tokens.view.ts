import {
  AccessTokenValueObject,
  RefreshTokenEntity,
} from 'user-service/src/domain/token';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenEntity: RefreshTokenEntity;
}
