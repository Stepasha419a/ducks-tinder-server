import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchSmokingAttitudeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly smokingAttitude: string | null,
  ) {}
}
