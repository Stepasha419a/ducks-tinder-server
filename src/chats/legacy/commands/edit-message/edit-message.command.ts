import { EditMessageDto } from 'chats/legacy/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class EditMessageCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: EditMessageDto,
  ) {}
}
