import { Module, forwardRef } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { ChatQueryHandlers } from './legacy/queries';
import { TokensModule } from 'tokens/tokens.module';
import { UsersModule } from 'users/users.module';
import { ChatAdapter, ChatRepository, chatFacadeFactory } from './providers';
import { CHAT_COMMAND_HANDLERS } from './application-services/commands';
import { CHAT_QUERY_HANDLERS } from './application-services/queries';
import { ChatFacade } from './application-services';

@Module({
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ChatsGateway,
    ...ChatQueryHandlers,
    ...CHAT_COMMAND_HANDLERS,
    ...CHAT_QUERY_HANDLERS,
    { provide: ChatRepository, useClass: ChatAdapter },
    {
      provide: ChatFacade,
      inject: [CommandBus, QueryBus],
      useFactory: chatFacadeFactory,
    },
  ],
  imports: [
    PrismaModule,
    CqrsModule,
    EventEmitterModule.forRoot(),
    TokensModule,
    forwardRef(() => UsersModule),
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
