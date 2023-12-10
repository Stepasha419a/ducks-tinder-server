import { Module } from '@nestjs/common';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { MapsService } from './maps.service';
import { HttpModule } from '@nestjs/axios';
import { MapApi, MapApiAdapter, mapFacadeFactory } from './providers';
import { MapQueryHandlers } from './application-services/queries';
import { MapFacade } from './application-services';

@Module({
  providers: [
    MapsService,
    ...MapQueryHandlers,
    {
      provide: MapFacade,
      inject: [QueryBus],
      useFactory: mapFacadeFactory,
    },
    {
      provide: MapApi,
      useClass: MapApiAdapter,
    },
  ],
  imports: [CqrsModule, HttpModule],
  exports: [MapsService],
})
export class MapsModule {}
