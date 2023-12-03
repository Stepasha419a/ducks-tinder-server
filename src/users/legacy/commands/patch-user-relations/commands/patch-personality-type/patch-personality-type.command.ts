import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchPersonalityTypeCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly personalityType: string | null,
  ) {}
}
