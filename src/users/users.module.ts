import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { FilesModule } from '../files/files.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserCommandHandlers } from './legacy/commands';
import { UserQueryHandlers } from './legacy/queries';
import { ChatsModule } from 'chats/chats.module';
import { MapsModule } from 'maps/maps.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filters';
import { USER_QUERY_HANDLERS } from './application-services/queries';
import { USER_COMMAND_HANDLERS } from './application-services/commands';
import { UserFacade } from './application-services';
import { UserRepository, userFacadeFactory } from './providers';
import { UserAdapter } from './providers';

@Module({
  providers: [
    UsersService,
    ...UserCommandHandlers,
    ...UserQueryHandlers,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
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
  controllers: [UsersController],
  imports: [
    PrismaModule,
    CqrsModule,
    FilesModule,
    forwardRef(() => ChatsModule),
    MapsModule,
  ],
  exports: [UsersService, UserFacade],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  onModuleInit() {
    this.commandBus.register(USER_COMMAND_HANDLERS);
    this.queryBus.register(USER_QUERY_HANDLERS);
  }
}
