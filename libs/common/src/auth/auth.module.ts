import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq';
import { SERVICES } from '../shared/constant';

@Module({
  imports: [RabbitMQModule.register(SERVICES.USER)],
  exports: [RabbitMQModule],
})
export class AuthModule {}
