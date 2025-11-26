import { Controller, Logger } from '@nestjs/common';
import { UserFacade } from 'src/application/user';
import { ShortUser, UserMapper } from 'src/infrastructure/user/mapper';
import { CreateUserDto } from 'src/application/user/command';
import { GrpcMethod } from '@nestjs/microservices';
import {
  getGrpcPackageServiceName,
  GetShortUserRequest,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';
import { UserGrpcServiceEndpoint } from 'src/infrastructure/grpc/service/service';

@Controller()
export class UserGrpcController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

  private readonly logger = new Logger(UserGrpcController.name);
}
