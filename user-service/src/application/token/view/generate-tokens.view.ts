import { AccessTokenValueObject, RefreshTokenEntity } from 'src/domain/token';

export interface GenerateTokensView {
  accessTokenValueObject: AccessTokenValueObject;
  refreshTokenEntity: RefreshTokenEntity;
}
