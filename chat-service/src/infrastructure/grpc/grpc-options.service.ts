import { Injectable, Logger } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { GRPC_SERVICE } from './service';

@Injectable()
export class GrpcOptionsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(GrpcOptionsService.name);

  getOptions(): GrpcOptions {
    this.logger.log(`Initializing gRPC server: ${GRPC_SERVICE.CHAT}`);
    const port = this.configService.get<string>('GRPC_PORT');

    return {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${port}`,
        package: 'chat',
        loader: {
          keepCase: true,
        },
        gracefulShutdown: true,
        keepalive: {
          keepaliveTimeMs: 10 * 1000,
          keepaliveTimeoutMs: 5 * 1000,
          keepalivePermitWithoutCalls: 1,
        },
        protoPath: path.join(process.cwd(), 'proto/chat.proto'),
      },
    };
  }
}
