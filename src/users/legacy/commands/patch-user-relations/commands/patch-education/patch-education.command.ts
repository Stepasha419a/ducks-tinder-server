import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchEducationCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly education: string | null,
  ) {}
}
