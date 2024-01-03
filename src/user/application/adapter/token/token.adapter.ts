import { UserTokenDto } from 'user/application/adapter/token';
import { GenerateTokensView } from './view';

export abstract class TokenAdapter {
  abstract generateTokens(dto: UserTokenDto): Promise<GenerateTokensView>;
  abstract removeToken(refreshTokenValue: string): Promise<void>;
  abstract validateRefreshToken(
    refreshTokenValue: string,
  ): Promise<UserTokenDto | null>;
  abstract validateAccessToken(
    accessTokenValue: string,
  ): Promise<UserTokenDto | null>;
}
