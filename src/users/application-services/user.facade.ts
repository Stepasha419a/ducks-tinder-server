import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserDto,
  PatchUserDto,
  PatchUserPlaceCommand,
  PatchUserPlaceDto,
} from './commands';
import { CreateUserCommand, PatchUserCommand } from './commands';
import { GetSortedQuery, GetUserByEmailQuery, GetUserQuery } from './queries';
import { ShortUserWithDistance, UserAggregate } from 'users/domain';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createUser: (dto: CreateUserDto) => this.createUser(dto),
    patchUser: (userId: string, dto: PatchUserDto) =>
      this.patchUser(userId, dto),
    patchUserPlace: (userId: string, dto: PatchUserPlaceDto) =>
      this.patchUserPlace(userId, dto),
  };
  queries = {
    getUser: (id: string) => this.getUser(id),
    getUserByEmail: (email: string) => this.getUserByEmail(email),
    getSorted: (id: string) => this.getSorted(id),
  };

  private createUser(dto: CreateUserDto) {
    return this.commandBus.execute<CreateUserCommand, UserAggregate>(
      new CreateUserCommand(dto),
    );
  }

  private patchUser(userId: string, dto: PatchUserDto) {
    return this.commandBus.execute<PatchUserCommand, UserAggregate>(
      new PatchUserCommand(userId, dto),
    );
  }

  private patchUserPlace(userId: string, dto: PatchUserPlaceDto) {
    return this.commandBus.execute<PatchUserPlaceCommand, UserAggregate>(
      new PatchUserPlaceCommand(userId, dto),
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

  private getSorted(id: string) {
    return this.queryBus.execute<GetSortedQuery, ShortUserWithDistance>(
      new GetSortedQuery(id),
    );
  }
}
