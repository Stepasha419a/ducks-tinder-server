import { LoginUserDto } from 'src/application/auth/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
