import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCoordsGeocodeQuery, GetCoordsGeocodeDto } from './queries';
import { Geocode } from 'maps/domain';

@Injectable()
export class MapFacade {
  constructor(private readonly queryBus: QueryBus) {}

  queries = {
    getCoordsGeocode: (dto: GetCoordsGeocodeDto) => this.getCoordsGeocode(dto),
  };

  getCoordsGeocode(dto: GetCoordsGeocodeDto) {
    return this.queryBus.execute<GetCoordsGeocodeQuery, Geocode>(
      new GetCoordsGeocodeQuery(dto),
    );
  }
}
