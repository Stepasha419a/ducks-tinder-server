import { SendMessageDto } from '../dto';

export class SendMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: SendMessageDto,
    public readonly notifyUserIds: string[],
  ) {}
}
