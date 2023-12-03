import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchSocialNetworksActivityCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly socialNetworksActivity: string | null,
  ) {}
}
