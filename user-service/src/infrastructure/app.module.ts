import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/interface/common';
import { DomainModule } from 'src/domain';
import { MetricsModule } from './metrics';
import { HealthModule } from './health';

@Module({
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        CLIENT_IDENTITY_PASSWORD: Joi.string().required(),
        CLIENT_IDENTITY_PATH: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('dev', 'dev-docker', 'dev-k8s', 'prod', 'test')
          .default('dev'),
        PORT: Joi.number().default(5000),
        HEALTH_PORT: Joi.number().default(35000),
        GEOCODE_API_URL: Joi.string().required(),
        GEOCODE_API_KEY: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        GRPC_FILE_SERVICE_URL: Joi.string().required(),
      }),
    }),
    HealthModule,
    UserModule,
    DomainModule,
    MetricsModule,
  ],
})
export class AppModule {}
