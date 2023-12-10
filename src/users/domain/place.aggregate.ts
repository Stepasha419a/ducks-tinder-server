import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { Place, UserPlaceInfo } from './place.interface';
import { DomainError } from 'users/errors';

export class PlaceAggregate extends AggregateRoot implements Place {
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

  getUserPlaceInfo(): UserPlaceInfo {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
      name: this.name,
    };
  }
}
