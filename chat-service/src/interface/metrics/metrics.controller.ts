import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { Public } from '../common';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
