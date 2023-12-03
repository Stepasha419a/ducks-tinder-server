import { ValidatedUserDto } from 'users/legacy/dto';

export class GetPairsQuery {
  constructor(public readonly user: ValidatedUserDto) {}
}
