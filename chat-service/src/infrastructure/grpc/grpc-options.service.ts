import { Injectable } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class GrpcOptionsService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(): GrpcOptions {
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
        protoPath: path.join(process.cwd(), 'proto/chat.proto'),
      },
    };
  }
}
