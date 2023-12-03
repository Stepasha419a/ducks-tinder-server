import { NotValidatedUserDto, PatchUserPlaceDto } from 'users/legacy/dto';

export class PatchUserPlaceCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly dto: PatchUserPlaceDto,
  ) {}
}
