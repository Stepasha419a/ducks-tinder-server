import { User } from 'user/domain';
import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from './value-object';

export interface AuthUser {
  user: User;
  refreshToken: RefreshTokenValueObject;
  accessToken: AccessTokenValueObject;
}
