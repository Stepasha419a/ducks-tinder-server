import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '../common';

@Controller('health')
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
}
