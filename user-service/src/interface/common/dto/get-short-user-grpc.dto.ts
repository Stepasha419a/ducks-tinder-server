import { IsUUID } from 'class-validator';
import { user } from 'src/infrastructure/grpc/gen';

export class GrpcShortUserGrpcDto implements user.GetShortUserRequest {
  @IsUUID('4')
  id: string;
}
