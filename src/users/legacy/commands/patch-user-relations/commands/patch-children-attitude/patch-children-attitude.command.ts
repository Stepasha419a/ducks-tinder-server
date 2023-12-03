import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchChildrenAttitudeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly childrenAttitude: string | null,
  ) {}
}
