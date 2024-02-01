import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq';
import { SERVICES } from '../constants';

@Module({
  imports: [RabbitMQModule.register(SERVICES.AUTH)],
  exports: [RabbitMQModule],
})
export class AuthModule {}
