import { CreateChatDto } from './dto';

export abstract class ChatApi {
  abstract createChat(dto: CreateChatDto);
}
