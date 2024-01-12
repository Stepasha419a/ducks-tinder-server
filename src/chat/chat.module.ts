import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatController, ChatGateway } from './interface';
import { PrismaModule } from 'prisma/prisma.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserModule } from 'user/user.module';
import { ChatRepository } from './domain/repository';
import { ChatAdapter } from './infrastructure/repository';
import { chatFacadeFactory } from './infrastructure/facade';
import { CHAT_COMMAND_HANDLERS } from 'chat/application/command';
import { CHAT_QUERY_HANDLERS } from 'chat/application/query';
import { ChatFacade } from './application';
import { CHAT_EVENT_HANDLERS } from './application/event';
import { AuthModule } from 'auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ...CHAT_COMMAND_HANDLERS,
    ...CHAT_QUERY_HANDLERS,
    ...CHAT_EVENT_HANDLERS,
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
