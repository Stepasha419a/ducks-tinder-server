import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { FilesModule } from '../files/files.module';
import { UserController, UserService } from './interface';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatsModule } from 'chats/chats.module';
import { MapsModule } from 'maps/maps.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './interface/filter';
import { USER_QUERY_HANDLERS } from './application/query';
import { USER_COMMAND_HANDLERS } from './application/command';
import { UserFacade } from './application';
import { UserRepository } from 'user/application/repository';
import { UserAdapter } from 'user/infrastructure/repository';
import { userFacadeFactory } from 'user/infrastructure/facade';

@Module({
  providers: [
    UserService,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
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
  controllers: [UserController],
  imports: [
    PrismaModule,
    CqrsModule,
    FilesModule,
    forwardRef(() => ChatsModule),
    MapsModule,
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
