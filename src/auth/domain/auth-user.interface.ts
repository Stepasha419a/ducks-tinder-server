import { ResponseUser } from 'user/domain';
import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from './value-object';

export interface AuthUser {
  user: ResponseUser;
  refreshToken: RefreshTokenValueObject;
  accessToken: AccessTokenValueObject;
}
