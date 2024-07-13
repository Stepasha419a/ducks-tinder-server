import { Controller, Get } from '@nestjs/common';
import { MetricsService } from '../../infrastructure/metrics/metrics.service';
import { Public } from 'src/interface/common';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  getMetrics() {
    return this.metricsService.getMetrics();
  }
}
