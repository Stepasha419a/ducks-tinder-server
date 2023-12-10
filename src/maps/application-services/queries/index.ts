export { GetCoordsGeocodeQuery } from './get-coords-geocode';

export * from './dto';

import { GetCoordsGeocodeQueryHandler } from './get-coords-geocode';

export const MapQueryHandlers = [GetCoordsGeocodeQueryHandler];
