import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE, getGrpcPackageName } from './service/service';
import { ConfigService } from '@nestjs/config';
import { DomainModule } from 'src/domain';
import { FileService } from 'src/domain/service/file';
import { FileServiceAdapter } from '../adapter/file-service';
import { ChannelCredentials } from '@grpc/grpc-js';
import { readFileSync } from 'fs';
import * as path from 'path';

@Module({
  providers: [{ provide: FileService, useClass: FileServiceAdapter }],
  exports: [FileService],
  imports: [DomainModule],
})
export class GrpcModule {
  static register(...names: GRPC_SERVICE[]): DynamicModule {
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
