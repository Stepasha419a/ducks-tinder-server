import { CreateChatDto } from 'src/application/command';
import { chat } from 'src/infrastructure/grpc/gen';

export class CreateChatGrpcDto
  extends CreateChatDto
  implements chat.CreateChatRequest {}
