import {
  AccessTokenValueObject,
  RefreshTokenEntity,
} from 'user-service/src/domain/token';
import { User } from 'user-service/src/domain/user';

export interface AuthUserView extends User {
  refreshToken: RefreshTokenEntity;
  accessToken: AccessTokenValueObject;
}
