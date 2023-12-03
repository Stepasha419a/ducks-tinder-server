import { GetMessagesDto } from 'chats/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class GetMessagesQuery {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: GetMessagesDto,
  ) {}
}
