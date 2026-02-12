import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { MetricsService } from '../../infrastructure/metrics/metrics.service';
import { HealthPortGuard, Public } from 'src/interface/common';

@Controller('metrics')
@UseGuards(HealthPortGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
