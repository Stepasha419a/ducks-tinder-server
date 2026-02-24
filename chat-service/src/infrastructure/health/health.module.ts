import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcHealthIndicator } from './grpc.health';
import { HealthController } from 'src/interface/health';
import { GrpcModule } from '../grpc';
import { DatabaseModule } from '../database';

@Module({
  providers: [GrpcHealthIndicator],
  imports: [TerminusModule, GrpcModule, DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
