import { NestFactory } from '@nestjs/core';
import { ChatModule } from './infrastructure/chat.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { GrpcOptionsService } from './infrastructure/grpc';
import * as https from 'https';

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

  const app = await NestFactory.create(ChatModule, { httpsOptions });

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  const grpcOptionsService = app.get(GrpcOptionsService);

  app.connectMicroservice(grpcOptionsService.getOptions());

  await app.startAllMicroservices();

  const port = configService.get('PORT');
  const healthPort = configService.get('HEALTH_PORT');

  await app.listen(port);

  const server = app.getHttpAdapter().getInstance();
  https.createServer(httpsOptions, server).listen(healthPort);
}
bootstrap();
