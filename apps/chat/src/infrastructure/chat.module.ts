import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatController, ChatGateway } from '../interface';
import { DatabaseModule } from '@app/common/database';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { ChatRepository } from '../domain/repository';
import { ChatAdapter } from './repository';
import { chatFacadeFactory } from './facade';
import { CHAT_COMMAND_HANDLERS } from 'apps/chat/src/application/command';
import { CHAT_QUERY_HANDLERS } from 'apps/chat/src/application/query';
import { ChatFacade } from '../application';
import { ChatMapper } from './mapper/chat.mapper';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/auth/guard';
import { AuthModule } from '@app/common/auth';
import { SERVICES } from '@app/common/shared/constant';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ...CHAT_COMMAND_HANDLERS,
    ...CHAT_QUERY_HANDLERS,
    ChatMapper,
    { provide: ChatRepository, useClass: ChatAdapter },
    {
      provide: ChatFacade,
      inject: [CommandBus, QueryBus],
      useFactory: chatFacadeFactory,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number().default(5000),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CqrsModule,
    EventEmitterModule.forRoot(),
    RabbitMQModule.register(SERVICES.USER),
    AuthModule,
  ],
})
export class ChatModule {}
