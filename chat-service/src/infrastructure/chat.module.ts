import { Module } from '@nestjs/common';
import { ChatController, ChatGateway } from '../interface';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { ChatRepository } from 'src/domain/chat/repository';
import { ChatAdapter } from './repository';
import { chatFacadeFactory } from './facade';
import { CHAT_COMMAND_HANDLERS } from 'src/application/command';
import { CHAT_QUERY_HANDLERS } from 'src/application/query';
import { ChatFacade } from '../application';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database';
import { RabbitMQModule } from './rabbitmq';
import { AccessTokenGuard } from 'src/interface/common/guard';
import { SERVICE } from './rabbitmq/service/service';
import { DomainModule } from 'src/domain';
import { MetricsModule } from './metrics';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ...CHAT_COMMAND_HANDLERS,
    ...CHAT_QUERY_HANDLERS,
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
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('dev', 'dev-docker', 'dev-k8s', 'prod', 'test')
          .default('dev'),
        PORT: Joi.number().default(5000),
        JWT_ACCESS_SECRET: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CqrsModule,
    RabbitMQModule.register(SERVICE.USER),
    DomainModule,
    MetricsModule,
  ],
})
export class ChatModule {}
