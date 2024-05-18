import { PatchUserDto } from 'src/application/user/command/dto';

export class PatchUserCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: PatchUserDto,
  ) {}
}
