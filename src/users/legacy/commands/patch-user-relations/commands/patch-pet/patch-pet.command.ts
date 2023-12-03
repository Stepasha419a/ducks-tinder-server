import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchPetCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly pet: string | null,
  ) {}
}
