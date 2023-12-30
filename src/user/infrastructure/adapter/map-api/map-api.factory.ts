import { QueryBus } from '@nestjs/cqrs';
import { MapApiImplementation } from './map-api.adapter-implementation';

export const mapApiFactory = (queryBus: QueryBus) =>
  new MapApiImplementation(queryBus);
