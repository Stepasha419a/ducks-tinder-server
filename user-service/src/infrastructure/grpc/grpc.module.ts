import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE, getGrpcPackageName } from './service/service';
import { FileGrpcServiceAdapter } from './service/file/file.grpc-service-adapter';
import { FileGrpcService } from './service/file';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [{ provide: FileGrpcService, useClass: FileGrpcServiceAdapter }],
  exports: [FileGrpcService],
})
export class GrpcModule {
  static register(...names: GRPC_SERVICE[]): DynamicModule {
    return {
      module: GrpcModule,
      imports: [
        ClientsModule.register(
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
                  },
                  url: configService.get(`${name}_URL`),
                  package: packageName,
                  protoPath: `proto/${packageName}.proto`,
                  channelOptions: {
                    'grpc.keepalive_time_ms': 10 * 1000,
                    'grpc.keepalive_timeout_ms': 5 * 1000,
                    'grpc.keepalive_permit_without_calls': 1,
                  },
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
