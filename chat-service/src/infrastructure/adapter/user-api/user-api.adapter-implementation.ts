import { Inject, Injectable } from '@nestjs/common';
import { UserApi } from 'src/application/adapter';
import {
  getGrpcPackageServiceName,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';
import { ClientGrpc } from '@nestjs/microservices';
import { user } from 'src/infrastructure/grpc/gen';

@Injectable()
export class UserApiImplementation implements UserApi {
  private userGrpcService: user.UserService;

  constructor(@Inject(GRPC_SERVICE.USER) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userGrpcService = this.client.getService<user.UserService>(
      getGrpcPackageServiceName(GRPC_SERVICE.USER),
    );
  }
}
