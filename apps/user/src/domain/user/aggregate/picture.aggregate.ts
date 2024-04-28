import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { randomUUID } from 'crypto';
import { AggregateRoot } from '@nestjs/cqrs';

export class PictureAggregate extends AggregateRoot {
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

  static create(picture: Partial<PictureAggregate>) {
    const _picture = new PictureAggregate();

    Object.assign(_picture, picture);

    const errors = validateSync(_picture, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Picture is invalid');
    }

    return _picture;
  }
}
