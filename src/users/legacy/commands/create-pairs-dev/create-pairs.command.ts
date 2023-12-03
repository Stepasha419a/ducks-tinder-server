import { ValidatedUserDto } from 'users/legacy/dto';

export class CreatePairsCommand {
  constructor(public readonly user: ValidatedUserDto) {}
}
