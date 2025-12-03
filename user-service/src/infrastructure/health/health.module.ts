import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { GrpcHealthIndicator } from './grpc.health';
import { HealthController } from 'src/interface/health';
import { RabbitMQModule } from '../rabbitmq';
import { GrpcModule } from '../grpc';
import { DatabaseModule } from '../database';

@Module({
  providers: [RabbitMQHealthIndicator, GrpcHealthIndicator],
  imports: [TerminusModule, RabbitMQModule, GrpcModule, DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
