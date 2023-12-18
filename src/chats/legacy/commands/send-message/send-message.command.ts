import { SendMessageDto } from 'chats/legacy/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class SendMessageCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: SendMessageDto,
  ) {}
}
