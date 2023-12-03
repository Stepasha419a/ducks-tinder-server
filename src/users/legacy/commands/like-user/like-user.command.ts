import { ValidatedUserDto } from 'users/legacy/dto';

export class LikeUserCommand {
  constructor(
    public readonly user: ValidatedUserDto,
    public readonly userPairId: string,
  ) {}
}
