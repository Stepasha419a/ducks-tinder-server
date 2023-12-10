import { QueryBus } from '@nestjs/cqrs';
import { MapFacade } from 'maps/application-services';

export const mapFacadeFactory = (queryBus: QueryBus) => new MapFacade(queryBus);
