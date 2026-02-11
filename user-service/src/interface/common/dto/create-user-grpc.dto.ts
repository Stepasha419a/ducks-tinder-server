import { CreateUserDto } from 'src/application/user/command';
import { user } from 'src/infrastructure/grpc/gen';

export class CreateUserGrpcDto
  extends CreateUserDto
  implements user.CreateUserRequest {}
