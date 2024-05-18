import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { randomUUID } from 'crypto';
import { DomainError } from 'src/domain/common';

export class PictureEntity {
  @IsUUID()
  id: string = randomUUID();

  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(8)
  order: number;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  static create(picture: Partial<PictureEntity>) {
    const _picture = new PictureEntity();

    Object.assign(_picture, picture);

    const errors = validateSync(_picture, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Picture is invalid');
    }

    return _picture;
  }
}
