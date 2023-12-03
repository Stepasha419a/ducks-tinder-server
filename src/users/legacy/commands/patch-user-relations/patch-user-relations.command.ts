import { NotValidatedUserDto, PatchUserRelationsDto } from 'users/legacy/dto';

export class PatchUserRelationsCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly dto: PatchUserRelationsDto,
  ) {}
}
