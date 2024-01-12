import { RefreshTokenValueObject } from '../value-object';

export abstract class RefreshTokenRepository {
  abstract save(
    refreshToken: RefreshTokenValueObject,
  ): Promise<RefreshTokenValueObject>;
  abstract findOne(id: string): Promise<RefreshTokenValueObject | null>;
  abstract findOneByValue(
    value: string,
  ): Promise<RefreshTokenValueObject | null>;
  abstract delete(id: string): Promise<boolean>;
}
