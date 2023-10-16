import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto, PatchUserDto } from './commands/dto';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  PatchUserCommand,
  PatchUserCommandHandler,
} from './commands';
import { GetUserQuery, GetUserQueryHandler } from './queries';

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
  };

  private createUser(dto: CreateUserDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(dto));
  }

  private patchUser(dto: PatchUserDto) {
    return this.commandBus.execute<
      PatchUserCommand,
      PatchUserCommandHandler['execute']
    >(new PatchUserCommand(dto));
  }

  private getUser(id: string) {
    return this.queryBus.execute<GetUserQuery, GetUserQueryHandler['execute']>(
      new GetUserQuery(id),
    );
  }
}
