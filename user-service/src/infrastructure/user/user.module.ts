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
import { MapApi } from '../../application/user/adapter';
import { UserController } from '../../interface/user';
import { HttpModule } from '@nestjs/axios';
import {
  MAP_API_QUERY_HANDLERS,
  MapApiImplementation,
} from '../adapter/map-api';
import { DatabaseModule } from '../database';
import { SERVICE } from '../rabbitmq/service/service';
import { RabbitMQModule } from '../rabbitmq';
import { FileService } from 'src/domain/service/file';
import { FILE_COMMAND_HANDLERS, FileAdapter } from '../adapter/file-service';
import { GrpcModule } from '../grpc';
import { GRPC_SERVICE } from '../grpc/service';

@Module({
  providers: [
    ...MAP_API_QUERY_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
    ...USER_DEV_HANDLERS,
    ...FILE_COMMAND_HANDLERS,
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
      provide: FileService,
      useClass: FileAdapter,
    },
  ],
  controllers: [UserController],
  imports: [
    DatabaseModule,
    CqrsModule,
    HttpModule,
    RabbitMQModule.register(SERVICE.CHAT, SERVICE.FILE),
    GrpcModule.register(GRPC_SERVICE.FILE),
  ],
  exports: [UserRepository],
})
export class UserModule {}
