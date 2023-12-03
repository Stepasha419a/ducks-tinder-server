import { ValidatedUserDto } from 'users/legacy/dto';

export class DislikeUserCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly userPairId: string,
  ) {}
}
