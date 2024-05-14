import { LoginUserDto } from 'user-service/src/application/auth/command';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
