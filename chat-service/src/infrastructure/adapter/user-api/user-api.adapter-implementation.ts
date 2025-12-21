import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserApi } from 'src/application/adapter';
import { ChatMemberView } from 'src/application/adapter/user-api/view';
import {
  getGrpcPackageServiceName,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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

  getChatMemberView(memberId: string): Promise<ChatMemberView> {
    return firstValueFrom<ChatMemberView>(
      this.userGrpcService.getShortUser({ id: memberId }),
    ).catch((err) => {
      throw new InternalServerErrorException();
    });
  }
}
