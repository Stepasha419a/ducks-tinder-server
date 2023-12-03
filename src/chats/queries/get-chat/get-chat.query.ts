import { ValidatedUserDto } from 'users/legacy/dto';

export class GetChatQuery {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly id: string,
  ) {}
}
