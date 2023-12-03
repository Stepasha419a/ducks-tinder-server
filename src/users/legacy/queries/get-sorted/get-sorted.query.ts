import { ValidatedUserDto } from 'users/legacy/dto';

export class GetSortedQuery {
  constructor(public readonly user: ValidatedUserDto) {}
}
