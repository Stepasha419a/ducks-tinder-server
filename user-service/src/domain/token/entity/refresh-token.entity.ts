import {
  IsJWT,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';

export class RefreshTokenEntity {
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

  static create(refreshToken: Partial<RefreshTokenEntity>) {
    const _refreshToken = new RefreshTokenEntity();

    Object.assign(_refreshToken, refreshToken);

    const errors = validateSync(_refreshToken, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Refresh token is invalid');
    }

    return _refreshToken;
  }
}
