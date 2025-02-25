import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { RabbitMQService } from './infrastructure/rabbitmq';
import * as path from 'path';
import * as fs from 'fs';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

async function bootstrap() {
  const configService = new ConfigService();

  const mode = configService.get<string>('NODE_ENV');
  const rootCertPath = path.join('cert', mode, 'ca.crt');
  const certPath = path.join('cert', mode, 'tls.crt');
  const keyPath = path.join('cert', mode, 'tls.key');
  const httpsOptions: HttpsOptions = {
    ca: fs.readFileSync(rootCertPath).toString(),
    key: fs.readFileSync(keyPath).toString(),
    cert: fs.readFileSync(certPath).toString(),
    rejectUnauthorized: true,
    requestCert: true,
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
