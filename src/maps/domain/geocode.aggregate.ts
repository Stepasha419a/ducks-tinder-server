import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { DomainError } from 'users/errors';
import { Geocode } from './geocode.interface';
import { AggregateRoot } from '@nestjs/cqrs';

export class GeocodeAggregate extends AggregateRoot implements Geocode {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  private constructor() {
    super();
  }

  static create(geocode: Partial<Geocode>) {
    const _geocode = new GeocodeAggregate();

    Object.assign(_geocode, geocode);

    const errors = validateSync(_geocode, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Geocode is invalid');
    }

    return _geocode;
  }

  getGeocode(): Geocode {
    return { address: this.address, name: this.name };
  }
}
