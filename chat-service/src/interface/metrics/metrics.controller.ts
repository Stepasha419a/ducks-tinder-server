import { Controller, Get } from '@nestjs/common';
import { MetricsService } from 'src/infrastructure/metrics/metrics.service';
import { Public } from '../common';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
