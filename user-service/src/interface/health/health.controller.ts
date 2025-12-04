import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../common';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly rmqHealth: RabbitMQHealthIndicator,
    private readonly db: DatabaseService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get('livez')
  @HealthCheck()
  checkLive() {
    return this.health.check([
      () => Promise.resolve({ live: { status: 'up' } }),
    ]);
  }

  @Get('readyz')
  @HealthCheck()
  checkReady() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.db),
      () => this.rmqHealth.isHealthy('rabbitmq'),
    ]);
  }

  @Get('startupz')
  @HealthCheck()
  checkStartup() {
    return this.health.check([
      () => Promise.resolve({ startup: { status: 'up' } }),
    ]);
  }
}
