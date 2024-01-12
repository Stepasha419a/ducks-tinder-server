import { LoginUserDto } from 'auth/application/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
