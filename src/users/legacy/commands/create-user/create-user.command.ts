import { CreateUserDto } from 'users/legacy/dto';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
