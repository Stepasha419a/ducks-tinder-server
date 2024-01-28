import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from '@app/common/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(rabbitMQService.getOptions('USER'));

  await app.startAllMicroservices();

  const port = configService.get('USER_SERVICE_PORT');

  await app.listen(port);
}
bootstrap();
