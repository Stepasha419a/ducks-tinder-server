import { QueryBus } from '@nestjs/cqrs';
import { Geocode, MapApi } from 'apps/user/src/application/adapter';
import { GetCoordsGeocodeQuery } from './query';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapApiImplementation implements MapApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getGeocode(latitude: number, longitude: number): Promise<Geocode> {
    return this.queryBus.execute(
      new GetCoordsGeocodeQuery({ latitude, longitude }),
    );
  }
}
