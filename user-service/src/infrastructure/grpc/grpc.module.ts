import { Global, Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE_CLIENTS, getGrpcPackageName } from './service/service';
import { ConfigService } from '@nestjs/config';
import { DomainModule } from 'src/domain';
import { FileApiImplementation } from '../adapter/file-api';
import { ChannelCredentials } from '@grpc/grpc-js';
import { readFileSync } from 'fs';
import * as path from 'path';
import { ChatApi, MapApi, FileApi } from 'src/application/user/adapter';
import { MapApiImplementation, ChatApiImplementation } from '../adapter';
import { GrpcOptionsService } from './grpc-options.service';

@Module({
  providers: [
    GrpcOptionsService,
    { provide: FileApi, useClass: FileApiImplementation },
    { provide: MapApi, useClass: MapApiImplementation },
    { provide: ChatApi, useClass: ChatApiImplementation },
  ],
    return {
      module: GrpcModule,
      imports: [
        ClientsModule.registerAsync(
          names.map((name) => {
            const packageName = getGrpcPackageName(name);

            return {
              name,
              useFactory: (configService: ConfigService) => {
                const mode = configService.get<string>('NODE_ENV');
                const rootCertPath = path.join('cert', mode, 'ca.crt');
                const certPath = path.join('cert', mode, 'tls.crt');
                const privateKeyPath = path.join('cert', mode, 'tls.key');

                const credentials = ChannelCredentials.createSsl(
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
      exports: [ClientsModule],
    };
  }
}
