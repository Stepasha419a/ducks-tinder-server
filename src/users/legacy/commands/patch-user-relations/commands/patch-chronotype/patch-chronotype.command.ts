import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchChronotypeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly chronotype: string | null,
  ) {}
}
