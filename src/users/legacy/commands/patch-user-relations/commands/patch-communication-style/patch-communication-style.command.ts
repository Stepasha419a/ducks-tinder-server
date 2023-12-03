import { NotValidatedUserDto } from 'users/legacy/dto';

export class PatchCommunicationStyleCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly communicationStyle: string | null,
  ) {}
}
