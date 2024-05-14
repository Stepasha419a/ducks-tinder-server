import { GeocodeView } from './view';

export abstract class MapApi {
  abstract getGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodeView>;
}
