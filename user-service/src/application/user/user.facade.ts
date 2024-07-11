import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AcceptPairCommand,
  DeletePairCommand,
  DeletePictureCommand,
  DislikeUserCommand,
  LikeUserCommand,
  MixPicturesCommand,
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceCommand,
  PatchUserPlaceDto,
  ReturnUserCommand,
  SavePictureCommand,
  PatchUserCommand,
  CreateUserDto,
  CreateUserCommand,
} from './command';
import {
  GetManyUsersQuery,
  GetMatchQuery,
  GetPairsInfoQuery,
  GetPairsQuery,
  GetUserQuery,
} from './query';
import { UserAggregate } from 'src/domain/user';
import { CreatePairsCommand, RemoveAllPairsCommand } from './command/dev';
import { PairsInfoView } from './view';
import { PairsFilterDto } from '../../domain/user/repository/dto';
import { UserCheckEntity } from '../../domain/user/entity';

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
    acceptPair: (userId: string, pairId: string) =>
      this.acceptPair(userId, pairId),
    savePicture: (userId: string, picture: Express.Multer.File) =>
      this.savePicture(userId, picture),
    deletePicture: (userId: string, pictureId: string) =>
      this.deletePicture(userId, pictureId),
    mixPictures: (userId: string, dto: MixPicturesDto) =>
      this.mixPictures(userId, dto),
    returnUser: (userId: string) => this.returnUser(userId),
    deletePair: (userId: string, pairId: string) =>
      this.deletePair(userId, pairId),
  };
  queries = {
    getUser: (id: string) => this.getUser(id),
    getManyUsers: (ids: string[]) => this.getManyUsers(ids),
    getMatch: (id: string, matchUserId?: string) =>
      this.getMatch(id, matchUserId),
    getPairs: (id: string, dto: PairsFilterDto) => this.getPairs(id, dto),
    getPairsInfo: (id: string) => this.getPairsInfo(id),
  };

  dev = {
    createPairsDEV: (id: string) => this.createPairsDEV(id),
    removeAllPairsDEV: (id: string) => this.removeAllPairsDEV(id),
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

  private likeUser(userId: string, pairId: string) {
    return this.commandBus.execute<LikeUserCommand, UserAggregate>(
      new LikeUserCommand(userId, pairId),
    );
  }

  private dislikeUser(userId: string, pairId: string) {
    return this.commandBus.execute<DislikeUserCommand, UserAggregate>(
      new DislikeUserCommand(userId, pairId),
    );
  }

  private acceptPair(userId: string, pairId: string) {
    return this.commandBus.execute<AcceptPairCommand, UserAggregate>(
      new AcceptPairCommand(userId, pairId),
    );
  }

  private deletePair(userId: string, pairId: string) {
    return this.commandBus.execute<DeletePairCommand, UserAggregate>(
      new DeletePairCommand(userId, pairId),
    );
  }

  private savePicture(userId: string, picture: Express.Multer.File) {
    return this.commandBus.execute<SavePictureCommand, UserAggregate>(
      new SavePictureCommand(userId, picture),
    );
  }

  private deletePicture(userId: string, pictureId: string) {
    return this.commandBus.execute<DeletePictureCommand, UserAggregate>(
      new DeletePictureCommand(userId, pictureId),
    );
  }

  private mixPictures(userId: string, dto: MixPicturesDto) {
    return this.commandBus.execute<MixPicturesCommand, UserAggregate>(
      new MixPicturesCommand(userId, dto),
    );
  }

  private returnUser(userId: string) {
    return this.commandBus.execute<ReturnUserCommand, UserCheckEntity>(
      new ReturnUserCommand(userId),
    );
  }

  private getUser(id: string) {
    return this.queryBus.execute<GetUserQuery, UserAggregate | null>(
      new GetUserQuery(id),
    );
  }

  private getManyUsers(ids: string[]) {
    return this.queryBus.execute<GetManyUsersQuery, UserAggregate[]>(
      new GetManyUsersQuery(ids),
    );
  }

  private getMatch(id: string, matchUserId?: string) {
    return this.queryBus.execute<GetMatchQuery, UserAggregate>(
      new GetMatchQuery(id, matchUserId),
    );
  }

  private getPairs(id: string, dto: PairsFilterDto) {
    return this.queryBus.execute<GetPairsQuery, UserAggregate[]>(
      new GetPairsQuery(id, dto),
    );
  }

  private getPairsInfo(id: string) {
    return this.queryBus.execute<GetPairsInfoQuery, PairsInfoView>(
      new GetPairsInfoQuery(id),
    );
  }

  private createPairsDEV(id: string) {
    return this.commandBus.execute<CreatePairsCommand>(
      new CreatePairsCommand(id),
    );
  }

  private removeAllPairsDEV(id: string) {
    return this.commandBus.execute<RemoveAllPairsCommand>(
      new RemoveAllPairsCommand(id),
    );
  }
}
