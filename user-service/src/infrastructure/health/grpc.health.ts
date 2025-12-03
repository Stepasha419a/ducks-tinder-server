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
}
