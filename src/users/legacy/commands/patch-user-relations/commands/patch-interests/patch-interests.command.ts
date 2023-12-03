import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchInterestsCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly interests: string[],
  ) {}
}
