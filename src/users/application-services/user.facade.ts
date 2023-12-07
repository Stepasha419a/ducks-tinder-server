import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto, PatchUserDto } from './commands/dto';
import { CreateUserCommand, PatchUserCommand } from './commands';
import { GetUserByEmailQuery, GetUserQuery } from './queries';
import { UserAggregate } from 'users/domain';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createUser: (dto: CreateUserDto) => this.createUser(dto),
    patchUser: (dto: PatchUserDto) => this.patchUser(dto),
  };
  queries = {
    getUser: (id: string) => this.getUser(id),
    getUserByEmail: (email: string) => this.getUserByEmail(email),
  };

  private createUser(dto: CreateUserDto) {
    return this.commandBus.execute<CreateUserCommand, UserAggregate>(
      new CreateUserCommand(dto),
    );
  }

  private patchUser(dto: PatchUserDto) {
    return this.commandBus.execute<PatchUserCommand, UserAggregate>(
      new PatchUserCommand(dto),
    );
  }

  private getUser(id: string) {
    return this.queryBus.execute<GetUserQuery, UserAggregate | null>(
      new GetUserQuery(id),
    );
  }

  private async getUserByEmail(email: string) {
    return this.queryBus.execute<GetUserByEmailQuery, UserAggregate | null>(
      new GetUserByEmailQuery(email),
    );
  }
}
