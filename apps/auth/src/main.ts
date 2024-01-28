import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from '@app/common/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(rabbitMQService.getOptions('AUTH'));

  await app.startAllMicroservices();

  const port = configService.get('AUTH_SERVICE_PORT');

  await app.listen(port);
}
bootstrap();
