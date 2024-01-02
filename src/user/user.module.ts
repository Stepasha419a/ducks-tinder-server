import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserController, UserService } from './interface';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from 'chat/chat.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './application/filter';
import { USER_QUERY_HANDLERS } from './application/query';
import { USER_COMMAND_HANDLERS } from './application/command';
import { UserFacade } from './application';
import { UserRepository } from 'user/application/repository';
import { UserAdapter } from 'user/infrastructure/repository';
import { userFacadeFactory } from 'user/infrastructure/facade';
import {
  MAP_API_QUERY_HANDLERS,
  MapApiImplementation,
} from './infrastructure/adapter/map-api';
import { AuthAdapter, FileAdapter, MapApi } from './application/adapter';
import { HttpModule } from '@nestjs/axios';
import {
  FILE_COMMAND_HANDLERS,
  FileAdapterImplementation,
} from './infrastructure/adapter/file';
import { JwtModule } from '@nestjs/jwt';
import { AuthAdapterImplementation } from './infrastructure/adapter';
import { AuthController } from './interface/auth';
import { AUTH_COMMAND_HANDLERS } from './infrastructure/adapter/auth';

@Module({
  providers: [
    UserService,
    ...MAP_API_QUERY_HANDLERS,
    ...FILE_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
    ...AUTH_COMMAND_HANDLERS,
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
    {
      provide: AuthAdapter,
      useClass: AuthAdapterImplementation,
    },
  ],
  controllers: [UserController, AuthController],
  imports: [
    PrismaModule,
    HttpModule,
    JwtModule,
    CqrsModule,
    forwardRef(() => ChatModule),
  ],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  onModuleInit() {
    this.commandBus.register(USER_COMMAND_HANDLERS);
    this.queryBus.register(USER_QUERY_HANDLERS);
  }
}
