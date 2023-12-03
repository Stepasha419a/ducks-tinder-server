import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './legacy/commands';
import { GetUserByEmailQuery, GetUserQuery } from './legacy/queries';
import { UserDto, CreateUserDto } from './legacy/dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getUser(id: string): Promise<UserDto> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }
}
