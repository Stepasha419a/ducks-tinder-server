import { User } from 'user/domain';

export interface AuthUserWithoutRefreshToken {
  user: User;
  accessToken: string;
}
