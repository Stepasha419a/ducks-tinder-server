import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQHealthIndicator {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    const isConnected = this.amqpConnection.managedConnection.isConnected();

    if (isConnected) {
      return indicator.up();
    }

    return indicator.down({ message: 'RabbitMQ check failed', isConnected });
  }
}
