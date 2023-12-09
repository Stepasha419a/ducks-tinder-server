import { PatchUserDto } from 'users/application-services/commands/dto';

export class PatchUserCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: PatchUserDto,
  ) {}
}
