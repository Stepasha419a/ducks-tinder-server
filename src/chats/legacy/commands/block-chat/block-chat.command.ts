import { ChatIdDto } from 'chats/legacy/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class BlockChatCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: ChatIdDto,
  ) {}
}
