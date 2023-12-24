import { EditMessageDto } from 'chats/legacy/dto';

export class EditMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: EditMessageDto,
  ) {}
}
