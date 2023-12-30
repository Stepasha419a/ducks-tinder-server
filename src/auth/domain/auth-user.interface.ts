import { AccessToken, RefreshToken } from 'tokens/domain';
import { ResponseUser } from 'user/domain';

export interface AuthUser {
  user: ResponseUser;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
}
