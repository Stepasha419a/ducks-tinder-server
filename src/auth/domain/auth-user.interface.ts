import { AccessToken, RefreshToken } from 'tokens/domain';
import { User } from 'users/domain';

export interface AuthUser {
  user: User;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
}
