import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/errors';

export class PlaceValueObject {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  static create(place: Partial<PlaceValueObject>) {
    const _place = new PlaceValueObject();

    Object.assign(_place, place);

    _place.updatedAt = _place?.id ? new Date().toISOString() : _place.updatedAt;
    const errors = validateSync(_place, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Place is invalid');
    }

    return _place;
  }
}
