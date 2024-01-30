import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserController } from './interface';
import { DatabaseModule } from '@app/common/database';
import { USER_QUERY_HANDLERS } from './application/query';
import { USER_COMMAND_HANDLERS } from './application/command';
import { UserFacade } from './application';
import { UserRepository } from 'apps/user/src/domain/repository';
import { UserAdapter } from 'apps/user/src/infrastructure/repository';
import { userFacadeFactory } from 'apps/user/src/infrastructure/facade';
import { MAP_API_QUERY_HANDLERS } from './infrastructure/adapter/map-api';
import { FileAdapter, MapApi } from './application/adapter';
import { HttpModule } from '@nestjs/axios';
import { FILE_COMMAND_HANDLERS } from './infrastructure/adapter/file';
import { JwtModule } from '@nestjs/jwt';
import {
  FileAdapterImplementation,
  MapApiImplementation,
} from './infrastructure/adapter';
import { USER_DEV_HANDLERS } from './application/command/dev';
import { UserMapper } from './infrastructure/mapper';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { SERVICES } from '@app/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/guards';

@Module({
  providers: [
    ...MAP_API_QUERY_HANDLERS,
    ...FILE_COMMAND_HANDLERS,
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
    {
      provide: MapApi,
      useClass: MapApiImplementation,
    },
    {
      provide: FileAdapter,
      useClass: FileAdapterImplementation,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  controllers: [UserController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number().default(5000),
        GEOCODE_API_URL: Joi.string().required(),
        GEOCODE_API_KEY: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    HttpModule,
    JwtModule,
    CqrsModule,
    RabbitMQModule.register(SERVICES.AUTH),
    RabbitMQModule.register(SERVICES.CHAT),
  ],
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
