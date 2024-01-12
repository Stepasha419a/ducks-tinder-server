import { LoginUserDto } from 'auth/application/commands/dto';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
