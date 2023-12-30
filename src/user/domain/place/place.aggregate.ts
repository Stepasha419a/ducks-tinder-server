import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { Place } from './place.interface';
import { DomainError } from 'libs/shared/errors';
import { PlaceServices } from './services';

export class PlaceAggregate extends PlaceServices implements Place {
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

  private constructor() {
    super();
  }

  static create(place: Partial<Place>) {
    const _place = new PlaceAggregate();

    Object.assign(_place, place);

    _place.updatedAt = _place?.id ? new Date().toISOString() : _place.updatedAt;
    const errors = validateSync(_place, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Place is invalid');
    }

    return _place;
  }
}
