import { QueryBus } from '@nestjs/cqrs';
import { GetCoordsGeocodeQuery } from './query';
import { Injectable } from '@nestjs/common';
import { Geocode, MapApi } from 'apps/user/src/application/user/adapter';

@Injectable()
export class MapApiImplementation implements MapApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getGeocode(latitude: number, longitude: number): Promise<Geocode> {
    return this.queryBus.execute(
      new GetCoordsGeocodeQuery({ latitude, longitude }),
    );
  }
}
