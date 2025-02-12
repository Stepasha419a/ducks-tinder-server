import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/interface/common';
import { DomainModule } from 'src/domain';
import { MetricsModule } from './metrics';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
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
        GEOCODE_API_URL: Joi.string().required(),
        GEOCODE_API_KEY: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        GRPC_FILE_SERVICE_URL: Joi.string().required(),
      }),
    }),
    UserModule,
    DomainModule,
    MetricsModule,
  ],
})
export class AppModule {}
