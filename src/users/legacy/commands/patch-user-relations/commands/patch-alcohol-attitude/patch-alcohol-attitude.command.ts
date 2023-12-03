import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchAlcoholAttitudeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly alcoholAttitude: string | null,
  ) {}
}
