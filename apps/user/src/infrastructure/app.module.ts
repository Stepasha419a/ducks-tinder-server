import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule as AuthCommonModule } from '@app/common/auth';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { RabbitMQModule } from '@app/common/rabbitmq';
import { SERVICES } from '@app/common/shared/constant';
import { FileModule } from '@app/common/file';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '@app/common/auth/guard';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
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
    UserModule,
    TokenModule,
    AuthModule,
    AuthCommonModule,
    RabbitMQModule.register(SERVICES.CHAT),
    FileModule,
  ],
})
export class AppModule {}
