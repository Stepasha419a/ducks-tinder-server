import { Injectable } from '@nestjs/common';
import { Geocode } from './domain';
import { MapFacade } from './application-services';
import { GetCoordsGeocodeDto } from './application-services/queries';

@Injectable()
export class MapsService {
  constructor(private readonly facade: MapFacade) {}

  getCoordsGeocode(latitude: number, longitude: number): Promise<Geocode> {
    return this.facade.queries.getCoordsGeocode(
      new GetCoordsGeocodeDto({ latitude, longitude }),
    );
  }
}
