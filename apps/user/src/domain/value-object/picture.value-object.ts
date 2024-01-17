import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/errors';

export class PictureValueObject {
  @IsUUID()
  id: string = randomStringGenerator();

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

  static create(picture: Partial<PictureValueObject>) {
    const _picture = new PictureValueObject();

    Object.assign(_picture, picture);

    _picture.updatedAt = _picture?.id
      ? new Date().toISOString()
      : _picture.updatedAt;
    const errors = validateSync(_picture, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Picture is invalid');
    }

    return _picture;
  }
}
