import { RegisterUserDto } from '../dto';

export class RegisterCommand {
  constructor(public readonly dto: RegisterUserDto) {}
}
