import { GetMessagesDto } from '../dto';

export class GetMessagesQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: GetMessagesDto,
  ) {}
}
