import { Global, Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE_CLIENTS, getGrpcPackageName } from './service';
import { ConfigService } from '@nestjs/config';
import { DomainModule } from 'src/domain';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ChannelCredentials } from '@grpc/grpc-js';
import { GrpcOptionsService } from './grpc-options.service';
import { UserApi } from 'src/application/adapter';
import { UserApiImplementation } from '../adapter';

@Global()
@Module({
  providers: [
    GrpcOptionsService,
    { provide: UserApi, useClass: UserApiImplementation },
  ],
  exports: [UserApi, ClientsModule, GrpcOptionsService],
  imports: [
    DomainModule,
    ClientsModule.registerAsync(
      Object.values(GRPC_SERVICE_CLIENTS).map((name) => {
        const packageName = getGrpcPackageName(name);

        return {
          name,
          useFactory: (configService: ConfigService) => {
            const logger = new Logger('GrpcClientFactory');

            logger.log(`Initializing gRPC client: ${name}`);

            const mode = configService.get<string>('NODE_ENV');

            let credentials = ChannelCredentials.createInsecure();

            const rootCertPath = path.join('cert', mode, 'ca.crt');
            const certPath = path.join('cert', mode, 'tls.crt');
            const privateKeyPath = path.join('cert', mode, 'tls.key');
            credentials = ChannelCredentials.createSsl(
              readFileSync(rootCertPath),
              readFileSync(privateKeyPath),
              readFileSync(certPath),
            );

            return {
              transport: Transport.GRPC,
              options: {
                keepalive: {
                  keepaliveTimeMs: 10 * 1000,
                  keepaliveTimeoutMs: 5 * 1000,
                  keepalivePermitWithoutCalls: 1,
                },
                url: configService.get(`${name}_URL`),
                package: packageName,
                protoPath: `proto/${packageName}.proto`,
                credentials,
              },
            };
          },
          inject: [ConfigService],
        };
      }),
    ),
  ],
})
export class GrpcModule {}
