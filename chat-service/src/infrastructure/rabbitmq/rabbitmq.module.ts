import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule as RMQ } from '@golevelup/nestjs-rabbitmq';
import * as fs from 'fs';
import * as path from 'path';
import { RABBITMQ } from './constants';

@Module({
  imports: [
    RMQ.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mode = config.get<string>('NODE_ENV');

        const certPath = path.join('cert', mode, 'tls.crt');
        const caPath = path.join('cert', mode, 'ca.crt');
        const keyPath = path.join('cert', mode, 'tls.key');

        return {
          uri: config.get('RABBIT_MQ_URI'),
          connectionInitOptions: {
            wait: true,
            timeout: 1000,
          },
          connectionManagerOptions: {
            reconnectTimeInSeconds: 3,
            connectionOptions: {
              cert: fs.readFileSync(certPath),
              key: fs.readFileSync(keyPath),
              ca: [fs.readFileSync(caPath)],
              rejectUnauthorized: true,
            },
          },
          exchanges: [
            {
              name: RABBITMQ.CHAT.QUEUE,
              type: 'topic',
            },
            {
              name: RABBITMQ.USER.QUEUE,
              type: 'topic',
            },
          ],
          channels: {
            consumer: {
              prefetchCount: 10,
              default: true,
            },
            producer: {
              prefetchCount: 1,
            },
          },
        };
      },
    }),
  ],
  exports: [RMQ],
})
export class RabbitMQModule {}
