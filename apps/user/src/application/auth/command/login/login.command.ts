import { LoginUserDto } from 'apps/user/src/application/auth/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
