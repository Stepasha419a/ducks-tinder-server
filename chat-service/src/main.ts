import { NestFactory } from '@nestjs/core';
import { ChatModule } from './infrastructure/chat.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from './infrastructure/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  await app.init();

  app.connectMicroservice(rabbitMQService.getOptions('CHAT', true));

  await app.startAllMicroservices();

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
