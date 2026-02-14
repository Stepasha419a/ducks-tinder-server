import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { HealthPortGuard, Public } from '../common';

@Public()
@UseGuards(HealthPortGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
