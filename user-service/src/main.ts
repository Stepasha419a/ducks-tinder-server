import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { RabbitMQService } from './infrastructure/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(rabbitMQService.getOptions('USER'));

  await app.startAllMicroservices();

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
