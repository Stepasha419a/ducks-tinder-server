import { DeleteMessageDto } from 'chats/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class DeleteMessageCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: DeleteMessageDto,
  ) {}
}
