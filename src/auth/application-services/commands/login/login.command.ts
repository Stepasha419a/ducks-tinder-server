import { LoginUserDto } from 'auth/application-services/commands/dto';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
