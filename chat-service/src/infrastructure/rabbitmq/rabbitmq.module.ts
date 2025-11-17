import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule as RMQ } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RMQ.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('RABBIT_MQ_URI'),
          connectionInitOptions: {
            wait: true,
            timeout: 1000,
          },
        };
      },
    }),
  ],
  exports: [RMQ],
})
export class RabbitMQModule {}
