import { Geocode } from './map-api.interface';

export abstract class MapApi {
  abstract getGeocode(latitude: number, longitude: number): Promise<Geocode>;
}
