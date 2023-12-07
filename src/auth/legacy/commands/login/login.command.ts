import { LoginUserDto } from 'auth/legacy/dto';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
