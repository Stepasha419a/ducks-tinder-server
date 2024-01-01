import { RefreshToken, RefreshTokenAggregate } from 'tokens/domain';

export abstract class RefreshTokenRepository {
  abstract save(refreshToken: RefreshToken): Promise<RefreshTokenAggregate>;
  abstract findOne(id: string): Promise<RefreshTokenAggregate | null>;
  abstract findOneByValue(value: string): Promise<RefreshTokenAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
}
