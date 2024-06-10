import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE, getGrpcPackageName } from './service/service';
import { ConfigService } from '@nestjs/config';
import { DomainModule } from 'src/domain';
import { FileService } from 'src/domain/service/file';
import { FileServiceAdapter } from '../adapter/file-service';

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
              useFactory: (configService: ConfigService) => ({
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
                },
              }),
              inject: [ConfigService],
            };
          }),
        ),
      ],
      exports: [ClientsModule],
    };
  }
}
