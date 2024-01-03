import { LoginUserDto } from 'user/application/facade/auth/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
