import { CreateChatDto } from '../dto';

export class CreateChatCommand {
  constructor(public readonly dto: CreateChatDto) {}
}
