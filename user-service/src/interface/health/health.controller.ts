import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { HealthPortGuard, Public } from '../common';
import { DatabaseService } from 'src/infrastructure/database';
import { GrpcHealthIndicator } from 'src/infrastructure/health/grpc.health';
import { getGrpcPackageName } from 'src/infrastructure/grpc/service';
import {
  getIsGrpcServiceCritical,
  GRPC_SERVICE_CLIENTS,
} from 'src/infrastructure/grpc/service';

@Public()
@UseGuards(HealthPortGuard)
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly grpcHealth: GrpcHealthIndicator,
    private readonly db: DatabaseService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get('livez')
  @HealthCheck()
  checkLive() {
    return this.health.check([
      () => Promise.resolve({ live: { status: 'up' } }),
    ]);
  }

  @Get('readyz')
  @HealthCheck()
  checkReady() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.db),
      ...Object.values(GRPC_SERVICE_CLIENTS).map(
        (service) => () =>
          this.grpcHealth.isHealthy(
            `${getGrpcPackageName(service)}ServiceGrpc`,
            service,
            getIsGrpcServiceCritical(service),
          ),
      ),
    ]);
  }

  @Get('startupz')
  @HealthCheck()
  checkStartup() {
    return this.health.check([
      () => Promise.resolve({ startup: { status: 'up' } }),
    ]);
  }
}
