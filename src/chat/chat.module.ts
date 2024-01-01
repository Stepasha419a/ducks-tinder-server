import { Module, forwardRef } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatController, ChatGateway, ChatService } from './interface';
import { PrismaModule } from 'prisma/prisma.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserModule } from 'user/user.module';
import { ChatRepository } from './application/repository';
import { ChatAdapter } from './infrastructure/repository';
import { chatFacadeFactory } from './infrastructure/facade';
import { CHAT_COMMAND_HANDLERS } from 'chat/application/command';
import { CHAT_QUERY_HANDLERS } from 'chat/application/query';
import { ChatFacade } from './application';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
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
    forwardRef(() => UserModule),
  ],
  exports: [ChatService],
})
export class ChatModule {}
