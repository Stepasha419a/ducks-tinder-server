import { ValidatedUserDto } from 'users/legacy/dto';

export class DeletePairCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly userPairId: string,
  ) {}
}
