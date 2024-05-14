import { RefreshTokenEntity } from '../entity';

export abstract class TokenRepository {
  abstract saveRefreshToken(
    refreshToken: RefreshTokenEntity,
  ): Promise<RefreshTokenEntity>;
  abstract findOneRefreshToken(id: string): Promise<RefreshTokenEntity | null>;
  abstract findOneRefreshTokenByValue(
    value: string,
  ): Promise<RefreshTokenEntity | null>;
  abstract deleteRefreshToken(id: string): Promise<boolean>;
}
