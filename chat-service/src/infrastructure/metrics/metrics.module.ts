import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from 'src/interface/metrics';

@Module({
  providers: [MetricsService],
  exports: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {}
