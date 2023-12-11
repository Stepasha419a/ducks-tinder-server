import { User } from 'users/domain';

export interface AuthUserWithoutRefreshToken {
  user: User;
  accessToken: string;
}
