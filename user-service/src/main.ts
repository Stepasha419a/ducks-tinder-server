import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { RabbitMQService } from './infrastructure/rabbitmq';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const configService = new ConfigService();

  const mode = configService.get<string>('NODE_ENV');
  const certPath = join('cert', mode, 'certificate.pem');
  const keyPath = join('cert', mode, 'private-key.pem');
  const httpsOptions = {
    key: readFileSync(keyPath).toString(),
    cert: readFileSync(certPath).toString(),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  const rabbitMQService = app.get(RabbitMQService);

  app.connectMicroservice(rabbitMQService.getOptions('USER'));

  await app.startAllMicroservices();

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
