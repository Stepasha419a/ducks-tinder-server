import { GetMessagesDto } from 'chats/legacy/dto';
import { ValidatedUserDto } from 'users/legacy/dto';

export class GetMessagesQuery {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly dto: GetMessagesDto,
  ) {}
}
