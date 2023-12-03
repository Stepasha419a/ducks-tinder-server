import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchZodiacSignCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly zodiacSign: string | null,
  ) {}
}
