import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
  ResponseUser,
} from 'user/domain';

export interface AuthUser {
  user: ResponseUser;
  refreshToken: RefreshTokenValueObject;
  accessToken: AccessTokenValueObject;
}
