import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_SERVICE_CLIENTS, getGrpcPackageName } from './service';
import { ConfigService } from '@nestjs/config';
import { DomainModule } from 'src/domain';
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
            return {
              transport: Transport.GRPC,
              options: {
                url: configService.get(`${name}_URL`),
                package: packageName,
                protoPath: `proto/${packageName}.proto`,
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
