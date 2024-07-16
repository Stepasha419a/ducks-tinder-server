import { Injectable, OnModuleInit } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private registry: Registry;

  onModuleInit() {
    this.registry = new Registry();
    this.registry.setDefaultLabels({
      app: 'user-service',
    });

    this.registerMetrics();
  }

  private registerMetrics() {
    collectDefaultMetrics({ register: this.registry });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
