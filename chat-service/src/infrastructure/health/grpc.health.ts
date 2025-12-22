import { connectivityState } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { getGrpcPackageServiceName, GRPC_SERVICE } from '../grpc/service';
import { Client } from '@grpc/grpc-js';

@Injectable()
export class GrpcHealthIndicator {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(
    key: string,
    service: GRPC_SERVICE,
    isCritical = true,
  ): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    const serviceName = getGrpcPackageServiceName(service);

    try {
      const grpcClient = this.moduleRef.get<ClientGrpc>(service, {
        strict: false,
      });

      if (!grpcClient) {
        return indicator.down({
          message: `Client with token ${service} not found in context`,
        });
      }

      const client = grpcClient.getClientByServiceName<Client>(serviceName);

      if (!client) {
        return indicator.down({
          message: `${serviceName} gRPC clientInstance not found`,
        });
      }

      const channel = client.getChannel();
      const state = channel.getConnectivityState(true);

      const isHealthy =
        state === connectivityState.READY || state === connectivityState.IDLE;

      if (isHealthy) {
        return indicator.up();
      }

      const errorDetails = {
        message: `${serviceName} gRPC check failed`,
        state,
        stateMessage: this.getStateName(state),
        isCritical,
      };

      return indicator.up(errorDetails);
    } catch (error) {
      return indicator.down({
        message: `${serviceName} gRPC check failed`,
        error: error.message,
      });
    }
  }

  private getStateName(state: number) {
    return (
      ['IDLE', 'CONNECTING', 'READY', 'TRANSIENT_FAILURE', 'SHUTDOWN'][state] ||
      'UNKNOWN'
    );
  }
}
