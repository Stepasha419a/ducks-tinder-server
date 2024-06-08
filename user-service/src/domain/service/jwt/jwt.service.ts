import { ServiceTokenView, UserTokenData, UserTokensView } from './view';

export abstract class JwtService {
  abstract generateUserTokens(userId: string): UserTokensView;
  abstract validateAccessToken(accessToken: string): Promise<UserTokenData>;
  abstract validateRefreshToken(refreshToken: string): Promise<UserTokenData>;
  abstract generateFileServiceToken(): ServiceTokenView;
  abstract validateFileServiceToken(accessToken: string): Promise<boolean>;
}
