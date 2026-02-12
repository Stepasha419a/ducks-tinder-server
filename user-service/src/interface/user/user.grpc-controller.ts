import { Controller, Logger, UsePipes } from '@nestjs/common';
import { UserFacade } from 'src/application/user';
import { ShortUser, UserMapper } from 'src/infrastructure/user/mapper';
import { GrpcMethod } from '@nestjs/microservices';
import {
  getGrpcPackageServiceName,
  GRPC_SERVICE,
  UserGrpcServiceEndpoints,
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
    UserGrpcServiceEndpoints.CreateUser,
  )
  async createUser(dto: CreateUserGrpcDto): Promise<ShortUser> {
    this.logger.log(
      'Received gRPC call',
      UserGrpcServiceEndpoints.CreateUser,
      dto,
    );

    try {
      const userAggregate = await this.facade.commands.createUser(dto);

      return this.mapper.getShortUser(userAggregate);
    } catch (error) {
      this.logger.error(
        'Failed to handle gRPC call',
        UserGrpcServiceEndpoints.CreateUser,
        error,
      );

      throw error;
    }
  }

  @GrpcMethod(
    getGrpcPackageServiceName(GRPC_SERVICE.USER),
    UserGrpcServiceEndpoints.GetShortUser,
  )
  async getShortUser(dto: GrpcShortUserGrpcDto): Promise<ShortUser> {
    this.logger.log(
      'Received gRPC call',
      UserGrpcServiceEndpoints.GetShortUser,
      dto,
    );

    try {
      const userAggregate = await this.facade.queries.getUser(dto.id);

      return this.mapper.getShortUser(userAggregate);
    } catch (error) {
      this.logger.error(
        'Failed to handle gRPC call',
        UserGrpcServiceEndpoints.GetShortUser,
        error,
      );

      throw error;
    }
  }
}
