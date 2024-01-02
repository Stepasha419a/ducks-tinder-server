import {
  AccessTokenObjectValue,
  RefreshToken,
  ResponseUser,
} from 'user/domain';

export interface AuthUser {
  user: ResponseUser;
  refreshToken: RefreshToken;
  accessToken: AccessTokenObjectValue;
}
