import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { AUTH_COMMAND_HANDLERS } from './application/command';
import { AuthFacade } from './application';
import { authFacadeFactory } from './infrastructure/facade';
import { UserModule } from 'apps/user/src/user.module';
import { TokenAdapter } from './application/adapter/token';
import { TokenAdapterImplementation } from './infrastructure/adapter';
import { TOKEN_COMMAND_HANDLERS } from './infrastructure/adapter/token';
import { RefreshTokenRepository } from './domain/repository';
import { RefreshTokenAdapter } from './infrastructure/repository';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@app/common/database';
import { AuthMapper } from './infrastructure/mapper';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/guards';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    ...TOKEN_COMMAND_HANDLERS,
    AuthMapper,
    {
      provide: AuthFacade,
      inject: [CommandBus],
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
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
    }),
    CqrsModule,
    JwtModule,
    DatabaseModule,
    UserModule,
  ],
  exports: [TokenAdapter],
})
export class AuthModule {}
