import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchFoodPreferenceCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly foodPreference: string | null,
  ) {}
}
