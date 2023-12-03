import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchTrainingAttitudeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly trainingAttitude: string | null,
  ) {}
}
