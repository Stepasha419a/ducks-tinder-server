import { PatchUserDto } from '../dto';

export class PatchUserCommand {
  constructor(public readonly dto: PatchUserDto) {}
}
