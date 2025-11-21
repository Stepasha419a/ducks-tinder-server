import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '../common';

@Public()
@Controller('health')
export class HealthController {
  @Get('livez')
  @HealthCheck()
  checkLive() {
    return { status: 'ok' };
  }

  @Get('readyz')
  @HealthCheck()
  checkReady() {
    return { status: 'ok' };
  }

  @Get('startupz')
  @HealthCheck()
  checkStartup() {
    return { status: 'ok' };
  }
}
