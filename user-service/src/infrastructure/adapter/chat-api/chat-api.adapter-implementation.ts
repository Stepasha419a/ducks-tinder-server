import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ChatApi } from 'src/application/user/adapter';
import { CreateChatDto } from 'src/application/user/adapter/chat-api/dto';
import { chat } from 'src/infrastructure/grpc/gen';
import {
  getGrpcPackageServiceName,
  GRPC_SERVICE,
} from 'src/infrastructure/grpc/service';

@Injectable()
export class ChatApiImplementation implements ChatApi {
  private chatGrpcService: chat.ChatService;

  constructor(@Inject(GRPC_SERVICE.CHAT) private readonly client: ClientGrpc) {}

  private readonly logger = new Logger(ChatApiImplementation.name);

  onModuleInit() {
    this.chatGrpcService = this.client.getService<chat.ChatService>(
      getGrpcPackageServiceName(GRPC_SERVICE.CHAT),
    );
  }

  createChat(dto: CreateChatDto): Promise<chat.ChatResponse> {
    return firstValueFrom(this.chatGrpcService.createChat(dto)).catch((err) => {
      this.logger.error(
        'Failed to handle grpc request',
        dto,
        err.message,
        err.stack,
      );

      throw new InternalServerErrorException();
    });
  }
}
