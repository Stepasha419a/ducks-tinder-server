import { AccessTokenValueObject, RefreshTokenEntity } from 'src/domain/token';
import { User } from 'src/domain/user';

export interface AuthUserView extends User {
  refreshToken: RefreshTokenEntity;
  accessToken: AccessTokenValueObject;
}
