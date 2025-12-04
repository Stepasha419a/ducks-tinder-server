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
