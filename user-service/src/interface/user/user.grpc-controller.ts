import { Controller, Logger, UsePipes } from '@nestjs/common';
import { UserFacade } from 'src/application/user';
import { ShortUser, UserMapper } from 'src/infrastructure/user/mapper';
import { CreateUserDto } from 'src/application/user/command';
import { GrpcMethod } from '@nestjs/microservices';
import {
  getGrpcPackageServiceName,
  GetShortUserRequest,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';
import { GrpcValidationPipe } from '../common';
import { CreateUserGrpcDto, GrpcShortUserGrpcDto } from '../common/dto';

@Controller()
@UsePipes(GrpcValidationPipe)
export class UserGrpcController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

  private readonly logger = new Logger(UserGrpcController.name);

  @GrpcMethod(
    getGrpcPackageServiceName(GRPC_SERVICE.USER),
    UserGrpcServiceEndpoint.CreateUser,
  )
  async createUser(data: CreateUserDto): Promise<ShortUser> {
    this.logger.log(
      'Received gRPC call',
      UserGrpcServiceEndpoint.CreateUser,
      data,
    );

    try {
      const userAggregate = await this.facade.commands.createUser(data);

      return this.mapper.getShortUser(userAggregate);
    } catch (error) {
      this.logger.error(
        'Failed to handle gRPC call',
        UserGrpcServiceEndpoint.CreateUser,
        error,
      );

      throw error;
    }
  }

  @GrpcMethod(
    getGrpcPackageServiceName(GRPC_SERVICE.USER),
    UserGrpcServiceEndpoint.GetShortUser,
  )
  async getShortUser(data: GetShortUserRequest): Promise<ShortUser> {
    this.logger.log(
      'Received gRPC call',
      UserGrpcServiceEndpoint.GetShortUser,
      data,
    );

    try {
      const userAggregate = await this.facade.queries.getUser(data.id);

      return this.mapper.getShortUser(userAggregate);
    } catch (error) {
      this.logger.error(
        'Failed to handle gRPC call',
        UserGrpcServiceEndpoint.GetShortUser,
        error,
      );

      throw error;
    }
  }
}
