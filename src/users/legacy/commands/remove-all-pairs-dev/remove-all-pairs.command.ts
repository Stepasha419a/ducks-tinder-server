import { ValidatedUserDto } from 'users/legacy/dto';

export class RemoveAllPairsCommand {
  constructor(public readonly user: ValidatedUserDto) {}
}
