import { CreateUserDto } from 'users/legacy/dto';

export class RegisterCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
