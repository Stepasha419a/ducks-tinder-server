import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {
  static register(name: string): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService): RmqOptions => {
              const mode = configService.get<string>('NODE_ENV');
              const certPath = path.join('cert', mode, 'certificate.pem');
              const rootCertPath = path.join('cert', mode, 'ca.crt');
              const keyPath = path.join('cert', mode, 'private-key.pem');

              return {
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>('RABBIT_MQ_URI')],
                  queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                  socketOptions: {
                    connectionOptions: {
                      cert: fs.readFileSync(certPath),
                      key: fs.readFileSync(keyPath),
                      ca: [fs.readFileSync(rootCertPath)],
                    },
                  },
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
