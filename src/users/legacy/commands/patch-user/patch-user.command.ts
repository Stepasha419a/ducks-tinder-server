import { NotValidatedUserDto, PatchUserDto } from 'users/legacy/dto';

export class PatchUserCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly dto: PatchUserDto,
  ) {}
}
