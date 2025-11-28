import { Observable } from 'rxjs';

export interface MapProtoService {
  getGeocode(req: GetGeocodeRequest): Observable<GetGeocodeResponse>;
}

export interface GetGeocodeRequest {
  latitude: number;
  longitude: number;
}

export interface GetGeocodeResponse {
  name: string;
  address: string;
}
