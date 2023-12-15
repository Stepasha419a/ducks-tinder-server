import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserDto,
  DislikeUserCommand,
  LikeUserCommand,
  PatchUserDto,
  PatchUserPlaceCommand,
  PatchUserPlaceDto,
  SavePictureCommand,
} from './commands';
import { CreateUserCommand, PatchUserCommand } from './commands';
import {
  GetPairsQuery,
  GetSortedQuery,
  GetUserByEmailQuery,
  GetUserQuery,
} from './queries';
import { UserAggregate } from 'users/domain';

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
    likeUser: (userId: string, pairId: string) => this.likeUser(userId, pairId),
    dislikeUser: (userId: string, pairId: string) =>
      this.dislikeUser(userId, pairId),
    savePicture: (userId: string, picture: Express.Multer.File) =>
      this.savePicture(userId, picture),
  };
  queries = {
    getUser: (id: string) => this.getUser(id),
    getUserByEmail: (email: string) => this.getUserByEmail(email),
    getSorted: (id: string) => this.getSorted(id),
    getPairs: (id: string) => this.getPairs(id),
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

  private likeUser(userId: string, pairId) {
    return this.commandBus.execute<LikeUserCommand>(
      new LikeUserCommand(userId, pairId),
    );
  }

  private dislikeUser(userId: string, pairId) {
    return this.commandBus.execute<DislikeUserCommand>(
      new DislikeUserCommand(userId, pairId),
    );
  }

  private savePicture(userId: string, picture: Express.Multer.File) {
    return this.commandBus.execute<SavePictureCommand>(
      new SavePictureCommand(userId, picture),
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
    return this.queryBus.execute<GetSortedQuery, UserAggregate>(
      new GetSortedQuery(id),
    );
  }

  private getPairs(id: string) {
    return this.queryBus.execute<GetPairsQuery, UserAggregate[]>(
      new GetPairsQuery(id),
    );
  }
}
