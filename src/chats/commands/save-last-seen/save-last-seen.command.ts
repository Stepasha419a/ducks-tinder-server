import { ChatIdDto } from 'chats/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class SaveLastSeenCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: ChatIdDto,
  ) {}
}
