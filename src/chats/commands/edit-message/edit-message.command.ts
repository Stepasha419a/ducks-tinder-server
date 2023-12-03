import { EditMessageDto } from 'chats/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class EditMessageCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: EditMessageDto,
  ) {}
}
