import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private registry: Registry;

  async onModuleInit() {
    this.registry = new Registry();
    this.registry.setDefaultLabels({
      app: 'chat-service',
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
