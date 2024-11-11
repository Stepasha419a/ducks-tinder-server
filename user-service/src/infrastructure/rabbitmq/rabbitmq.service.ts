import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RabbitMQService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    const mode = this.configService.get<string>('NODE_ENV');
    const certPath = path.join('cert', mode, 'certificate.pem');
    const rootCertPath = path.join('cert', mode, 'ca.crt');
    const keyPath = path.join('cert', mode, 'private-key.pem');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
        socketOptions: {
          connectionOptions: {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
            ca: [fs.readFileSync(rootCertPath)],
          },
        },
      },
    };
  }
}
