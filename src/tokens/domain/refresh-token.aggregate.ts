import {
  IsJWT,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { RefreshToken } from './refresh-token.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { DomainError } from 'libs/shared/errors';

export class RefreshTokenAggregate
  extends AggregateRoot
  implements RefreshToken
{
  @IsUUID()
  id: string;

  @IsJWT()
  value: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(refreshToken: Partial<RefreshToken>) {
    const _refreshToken = new RefreshTokenAggregate();

    Object.assign(_refreshToken, refreshToken);

    _refreshToken.updatedAt = _refreshToken?.id
      ? new Date().toISOString()
      : _refreshToken.updatedAt;
    const errors = validateSync(_refreshToken, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Refresh token is invalid');
    }

    return _refreshToken;
  }
}
