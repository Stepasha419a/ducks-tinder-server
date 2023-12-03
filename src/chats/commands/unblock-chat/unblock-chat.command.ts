import { ChatIdDto } from 'chats/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class UnblockChatCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: ChatIdDto,
  ) {}
}
