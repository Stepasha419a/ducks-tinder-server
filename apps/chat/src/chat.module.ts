import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatController, ChatGateway } from './interface';
import { PrismaModule } from '@app/common/prisma/prisma.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserModule } from 'apps/user/src/user.module';
import { ChatRepository } from './domain/repository';
import { ChatAdapter } from './infrastructure/repository';
import { chatFacadeFactory } from './infrastructure/facade';
import { CHAT_COMMAND_HANDLERS } from 'apps/chat/src/application/command';
import { CHAT_QUERY_HANDLERS } from 'apps/chat/src/application/query';
import { ChatFacade } from './application';
import { CHAT_EVENT_HANDLERS } from './application/event';
import { AuthModule } from 'apps/auth/src/auth.module';
import { ChatMapper } from './infrastructure/mapper/chat.mapper';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ...CHAT_COMMAND_HANDLERS,
    ...CHAT_QUERY_HANDLERS,
    ...CHAT_EVENT_HANDLERS,
    ChatMapper,
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
    UserModule,
    AuthModule,
  ],
})
export class ChatModule {}
