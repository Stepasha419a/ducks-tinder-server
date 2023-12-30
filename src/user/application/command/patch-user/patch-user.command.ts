import { PatchUserDto } from 'user/application/command/dto';

export class PatchUserCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: PatchUserDto,
  ) {}
}
