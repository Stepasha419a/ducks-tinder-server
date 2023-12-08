import { CreateUserDto } from 'users/application-services/commands/dto';

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
