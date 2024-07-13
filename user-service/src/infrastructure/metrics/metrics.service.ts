import { Injectable, OnModuleInit } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private requestCounter: Counter;
  private registry: Registry;

  onModuleInit() {
    this.registry = new Registry();
    this.registry.setDefaultLabels({
      app: 'nestjs-prometheus',
    });

    this.registerMetrics();
  }

  private registerMetrics() {
    collectDefaultMetrics({ register: this.registry });

    this.requestCounter = new Counter({
      name: 'nestjs_requests',
      help: 'Number of requests to the app',
    });
    this.registry.registerMetric(this.requestCounter);
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  async incrementCounter() {
    this.requestCounter.inc();
  }
}
