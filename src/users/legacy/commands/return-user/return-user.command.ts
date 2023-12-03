import { ValidatedUserDto } from 'users/legacy/dto';

export class ReturnUserCommand {
  constructor(public readonly user: ValidatedUserDto) {}
}
