import { RefreshTokenValueObject } from '../value-object';

export abstract class TokenRepository {
  abstract saveRefreshToken(
    refreshToken: RefreshTokenValueObject,
  ): Promise<RefreshTokenValueObject>;
  abstract findOneRefreshToken(
    id: string,
  ): Promise<RefreshTokenValueObject | null>;
  abstract findOneRefreshTokenByValue(
    value: string,
  ): Promise<RefreshTokenValueObject | null>;
  abstract deleteRefreshToken(id: string): Promise<boolean>;
}
