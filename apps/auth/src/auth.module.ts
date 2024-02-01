import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { AUTH_COMMAND_HANDLERS } from './application/command';
import { AuthFacade } from './application';
import { authFacadeFactory } from './infrastructure/facade';
import { TokenAdapter } from './application/adapter/token';
import { TokenAdapterImplementation } from './infrastructure/adapter';
import {
  TOKEN_COMMAND_HANDLERS,
  TOKEN_QUERY_HANDLERS,
} from './infrastructure/adapter/token';
import { RefreshTokenRepository } from './domain/repository';
import { RefreshTokenAdapter } from './infrastructure/repository';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@app/common/database';
import { AuthMapper } from './infrastructure/mapper';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/auth/guard';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { SERVICES } from '@app/common/constants';
import { AuthModule as AuthServiceModule } from '@app/common/auth/auth.module';

@Module({
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    ...TOKEN_COMMAND_HANDLERS,
    ...TOKEN_QUERY_HANDLERS,
    AuthMapper,
    {
      provide: AuthFacade,
      inject: [CommandBus, TokenAdapter],
      useFactory: authFacadeFactory,
    },
    {
      provide: TokenAdapter,
      useClass: TokenAdapterImplementation,
    },
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenAdapter,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number().default(5000),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    CqrsModule,
    JwtModule,
    DatabaseModule,
    RabbitMQModule.register(SERVICES.USER),
    AuthServiceModule,
  ],
})
export class AuthModule {}
