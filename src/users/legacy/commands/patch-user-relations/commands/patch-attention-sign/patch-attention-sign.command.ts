import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchAttentionSignCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly attentionSign: string | null,
  ) {}
}
