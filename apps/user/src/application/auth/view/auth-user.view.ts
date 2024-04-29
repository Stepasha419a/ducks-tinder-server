import {
  AccessTokenValueObject,
  RefreshTokenEntity,
} from 'apps/user/src/domain/token';
import { User } from 'apps/user/src/domain/user';

export interface AuthUserView extends User {
  refreshToken: RefreshTokenEntity;
  accessToken: AccessTokenValueObject;
}
