import { PatchUserDto } from 'user-service/src/application/user/command/dto';

export class PatchUserCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: PatchUserDto,
  ) {}
}
