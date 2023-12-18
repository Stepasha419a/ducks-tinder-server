import { ValidatedUserDto } from 'users/legacy/dto';

export class GetChatsQuery {
  constructor(public readonly user: ValidatedUserDto) {}
}
