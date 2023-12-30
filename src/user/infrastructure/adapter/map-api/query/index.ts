export { GetCoordsGeocodeQuery } from './get-coords-geocode';

export * from './dto';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetCoordsGeocodeQueryHandler } from './get-coords-geocode';

export const MAP_API_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetCoordsGeocodeQueryHandler,
];
