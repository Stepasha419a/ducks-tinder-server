import { GeocodeAggregate } from 'maps/domain/geocode.aggregate';

export abstract class MapApi {
  abstract getGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodeAggregate>;
}
