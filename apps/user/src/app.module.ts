import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserController } from './interface/user';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/auth/guard';
import { AuthModule as AuthCommonModule } from '@app/common/auth';
import { USER_QUERY_HANDLERS } from './application/user/query';
import { USER_COMMAND_HANDLERS } from './application/user/command';
import { USER_DEV_HANDLERS } from './application/user/command/dev';
import { UserMapper } from './infrastructure/user/mapper';
import { UserFacade } from './application/user';
import { userFacadeFactory } from './infrastructure/user/facade';
import { UserRepository } from './domain/user/repository';
import { UserAdapter } from './infrastructure/user/repository';
import { FileAdapter, MapApi } from './application/user/adapter';
import { AuthFacade } from './application/auth';
import { authFacadeFactory } from './infrastructure/auth/facade';
import { AUTH_COMMAND_HANDLERS } from './application/auth/command';
import { AuthMapper } from './infrastructure/auth/mapper';
import { AuthController } from './interface/auth';
import { TokenRepository } from './domain/token/repository';
import { TokenAdapter } from './infrastructure/token/repository';
import { TokenFacade } from './application/token';
import { tokenFacadeFactory } from './infrastructure/token/facade';
import { TokenController } from './interface/token';
import { TOKEN_COMMAND_HANDLERS } from './application/token/command';
import { TOKEN_QUERY_HANDLERS } from './application/token/query';
import { UserModule } from './infrastructure/user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { TokenModule } from './infrastructure/token/token.module';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { SERVICES } from '@app/common/shared/constant';
import { DatabaseModule } from '@app/common/database';
import { JwtModule } from '@nestjs/jwt';
import {
  MAP_API_QUERY_HANDLERS,
  MapApiImplementation,
} from './infrastructure/adapter/map-api';
import {
  FILE_COMMAND_HANDLERS,
  FileAdapterImplementation,
} from './infrastructure/adapter/file';

@Module({
  providers: [
    ...MAP_API_QUERY_HANDLERS,
    ...FILE_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_COMMAND_HANDLERS,
    ...USER_DEV_HANDLERS,
    ...TOKEN_COMMAND_HANDLERS,
    ...TOKEN_QUERY_HANDLERS,
    ...AUTH_COMMAND_HANDLERS,
    UserMapper,
    AuthMapper,
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
    {
      provide: AuthFacade,
      inject: [CommandBus],
      useFactory: authFacadeFactory,
    },
    {
      provide: TokenRepository,
      useClass: TokenAdapter,
    },
    {
      provide: TokenFacade,
      inject: [CommandBus, QueryBus],
      useFactory: tokenFacadeFactory,
    },
  ],
  controllers: [UserController, AuthController, TokenController],
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
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    JwtModule,
    CqrsModule,
    HttpModule,
    UserModule,
    TokenModule,
    AuthModule,
    AuthCommonModule,
    RabbitMQModule.register(SERVICES.CHAT),
  ],
})
export class AppModule {}
