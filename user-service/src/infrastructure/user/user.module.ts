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
import { UserController, UserGrpcController } from '../../interface/user';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database';
import { GrpcModule } from '../grpc';

@Module({
  providers: [
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
  ],
  controllers: [UserController, UserGrpcController],
  imports: [DatabaseModule, CqrsModule, HttpModule, GrpcModule],
  exports: [UserRepository],
})
export class UserModule {}
