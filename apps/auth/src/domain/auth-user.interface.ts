import { User } from 'apps/user/src/domain';
import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from './value-object';

export interface AuthUser extends User {
  refreshToken: RefreshTokenValueObject;
  accessToken: AccessTokenValueObject;
}
