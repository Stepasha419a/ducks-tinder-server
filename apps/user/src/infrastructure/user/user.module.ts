import { Module } from '@nestjs/common';
import { USER_QUERY_HANDLERS } from '../../application/user/query';
import { USER_COMMAND_HANDLERS } from '../../application/user/command';
import { USER_DEV_HANDLERS } from '../../application/user/command/dev';
import { UserMapper } from './mapper';
import { UserFacade } from '../../application/user';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { userFacadeFactory } from './facade';
import { UserRepository } from '../../domain/user/repository';
import { UserAdapter } from './repository';
import { FileAdapter, MapApi } from '../../application/user/adapter';
import { UserController } from '../../interface/user';
import { DatabaseModule } from '@app/common/database';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { SERVICES } from '@app/common/shared/constant';
import { HttpModule } from '@nestjs/axios';
import {
  MAP_API_QUERY_HANDLERS,
  MapApiImplementation,
} from '../adapter/map-api';
import {
  FILE_COMMAND_HANDLERS,
  FileAdapterImplementation,
} from '../adapter/file';

@Module({
  providers: [
    ...MAP_API_QUERY_HANDLERS,
    ...FILE_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
    ...USER_DEV_HANDLERS,
    UserMapper,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus],
      useFactory: userFacadeFactory,
    },
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
    {
      provide: MapApi,
      useClass: MapApiImplementation,
    },
    {
      provide: FileAdapter,
      useClass: FileAdapterImplementation,
    },
  ],
  controllers: [UserController],
  imports: [
    DatabaseModule,
    CqrsModule,
    HttpModule,
    RabbitMQModule.register(SERVICES.CHAT),
  ],
  exports: [UserRepository],
})
export class UserModule {}
