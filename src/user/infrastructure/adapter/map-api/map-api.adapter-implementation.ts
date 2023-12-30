import { QueryBus } from '@nestjs/cqrs';
import { Geocode, MapApi } from 'user/application/adapter';
import { GetCoordsGeocodeQuery } from './query';

export class MapApiImplementation implements MapApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getGeocode(latitude: number, longitude: number): Promise<Geocode> {
    return this.queryBus.execute(
      new GetCoordsGeocodeQuery({ latitude, longitude }),
    );
  }
}
