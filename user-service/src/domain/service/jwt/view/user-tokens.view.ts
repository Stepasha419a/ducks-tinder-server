import { AccessTokenValueObject, RefreshTokenEntity } from 'src/domain/token';

export interface UserTokensView {
  accessToken: AccessTokenValueObject;
  refreshToken: RefreshTokenEntity;
}
