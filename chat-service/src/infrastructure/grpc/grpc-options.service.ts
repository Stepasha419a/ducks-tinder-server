import { Injectable, Logger } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ServerCredentials } from '@grpc/grpc-js';
import { GRPC_SERVICE } from './service';

@Injectable()
export class GrpcOptionsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(GrpcOptionsService.name);

  getOptions(): GrpcOptions {
    this.logger.log(`Initializing gRPC server: ${GRPC_SERVICE.CHAT}`);

    const mode = this.configService.get<string>('NODE_ENV');
    const port = this.configService.get<string>('GRPC_PORT');

    const rootCert = readFileSync(
      path.join(process.cwd(), 'cert', mode, 'ca.crt'),
    );
    const certChain = readFileSync(
      path.join(process.cwd(), 'cert', mode, 'tls.crt'),
    );
    const privateKey = readFileSync(
      path.join(process.cwd(), 'cert', mode, 'tls.key'),
    );

    const credentials = ServerCredentials.createSsl(
      rootCert,
      [
        {
          cert_chain: certChain,
          private_key: privateKey,
        },
      ],
      true,
    );

    return {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${port}`,
        package: 'chat',
        gracefulShutdown: true,
        keepalive: {
          keepaliveTimeMs: 10 * 1000,
          keepaliveTimeoutMs: 5 * 1000,
          keepalivePermitWithoutCalls: 1,
        },
        protoPath: path.join(process.cwd(), 'proto/chat.proto'),
        credentials,
      },
    };
  }
}
