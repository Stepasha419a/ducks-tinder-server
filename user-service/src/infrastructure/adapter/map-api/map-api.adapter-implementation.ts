import { QueryBus } from '@nestjs/cqrs';
import { GetCoordsGeocodeQuery } from './query';
import { Injectable } from '@nestjs/common';
import { GeocodeView, MapApi } from 'user-service/src/application/user/adapter';

@Injectable()
export class MapApiImplementation implements MapApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getGeocode(latitude: number, longitude: number): Promise<GeocodeView> {
    return this.queryBus.execute(
      new GetCoordsGeocodeQuery({ latitude, longitude }),
    );
  }
}
