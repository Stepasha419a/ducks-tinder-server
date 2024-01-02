import { LoginUserDto } from 'user/infrastructure/adapter/auth/command/dto';

export class LoginCommand {
  constructor(public readonly dto: LoginUserDto) {}
}
