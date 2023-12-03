import { ValidatedUserDto } from 'users/legacy/dto';

export class AcceptPairCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly userPairId: string,
  ) {}
}
