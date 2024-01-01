import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AcceptPairCommand,
  CreateUserDto,
  DeletePairCommand,
  DeletePictureCommand,
  DislikeUserCommand,
  GenerateTokensCommand,
  LikeUserCommand,
  MixPicturesCommand,
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceCommand,
  PatchUserPlaceDto,
  RemoveTokenCommand,
  ReturnUserCommand,
  SavePictureCommand,
  UserTokenDto,
  ValidateAccessTokenCommand,
  ValidateRefreshTokenCommand,
} from './command';
import { CreateUserCommand, PatchUserCommand } from './command';
import {
  GetPairsQuery,
  GetSortedQuery,
  GetUserByEmailQuery,
  GetUserQuery,
} from './query';
import {
  AccessTokenObjectValue,
  RefreshTokenAggregate,
  UserAggregate,
  UserCheckAggregate,
} from 'user/domain';
import { CreatePairsCommand, RemoveAllPairsCommand } from './command/dev';

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
    generateTokens: (dto: UserTokenDto) => this.generateTokens(dto),
    removeToken: (refreshTokenValue: string) =>
      this.removeToken(refreshTokenValue),
    validateRefreshToken: (refreshTokenValue: string) =>
      this.validateRefreshToken(refreshTokenValue),
    validateAccessToken: (accessTokenValue: string) =>
      this.validateAccessToken(accessTokenValue),
  };
  queries = {
    getUser: (id: string) => this.getUser(id),
    getUserByEmail: (email: string) => this.getUserByEmail(email),
    getSorted: (id: string, sortedUserId?: string) =>
      this.getSorted(id, sortedUserId),
    getPairs: (id: string) => this.getPairs(id),
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
    return this.commandBus.execute<LikeUserCommand>(
      new LikeUserCommand(userId, pairId),
    );
  }

  private dislikeUser(userId: string, pairId: string) {
    return this.commandBus.execute<DislikeUserCommand>(
      new DislikeUserCommand(userId, pairId),
    );
  }

  private acceptPair(userId: string, pairId: string) {
    return this.commandBus.execute<AcceptPairCommand, string>(
      new AcceptPairCommand(userId, pairId),
    );
  }

  private deletePair(userId: string, pairId: string) {
    return this.commandBus.execute<DeletePairCommand, string>(
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
    return this.commandBus.execute<ReturnUserCommand, UserCheckAggregate>(
      new ReturnUserCommand(userId),
    );
  }

  private generateTokens(dto: UserTokenDto) {
    return this.commandBus.execute<
      GenerateTokensCommand,
      {
        accessTokenAggregate: AccessTokenObjectValue;
        refreshTokenAggregate: RefreshTokenAggregate;
      }
    >(new GenerateTokensCommand(dto));
  }

  private removeToken(refreshTokenValue: string) {
    return this.commandBus.execute<RemoveTokenCommand>(
      new RemoveTokenCommand(refreshTokenValue),
    );
  }

  private validateRefreshToken(refreshTokenValue: string) {
    return this.commandBus.execute<
      ValidateRefreshTokenCommand,
      UserTokenDto | null
    >(new ValidateRefreshTokenCommand(refreshTokenValue));
  }

  private validateAccessToken(accessTokenValue: string) {
    return this.commandBus.execute<
      ValidateAccessTokenCommand,
      UserTokenDto | null
    >(new ValidateAccessTokenCommand(accessTokenValue));
  }

  private getUser(id: string) {
    return this.queryBus.execute<GetUserQuery, UserAggregate | null>(
      new GetUserQuery(id),
    );
  }

  private getUserByEmail(email: string) {
    return this.queryBus.execute<GetUserByEmailQuery, UserAggregate | null>(
      new GetUserByEmailQuery(email),
    );
  }

  private getSorted(id: string, sortedUserId?: string) {
    return this.queryBus.execute<GetSortedQuery, UserAggregate>(
      new GetSortedQuery(id, sortedUserId),
    );
  }

  private getPairs(id: string) {
    return this.queryBus.execute<GetPairsQuery, UserAggregate[]>(
      new GetPairsQuery(id),
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
