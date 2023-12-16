import { AccessToken, RefreshToken } from 'tokens/domain';
import { ResponseUser } from 'users/domain';

export interface AuthUser {
  user: ResponseUser;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
}
