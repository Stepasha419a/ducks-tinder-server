import { EditMessageDto } from '../dto';

export class EditMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: EditMessageDto,
  ) {}
}
