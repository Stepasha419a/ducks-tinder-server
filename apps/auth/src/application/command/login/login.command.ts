import { LoginUserDto } from 'apps/auth/src/application/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
