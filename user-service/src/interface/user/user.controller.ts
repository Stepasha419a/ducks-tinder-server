import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Patch,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  ParseUUIDPipe,
  Query,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFacade } from 'src/application/user';
import {
  ShortUser,
  UserMapper,
  WithoutPrivateFields,
} from 'src/infrastructure/user/mapper';
import {
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceDto,
} from 'src/application/user/command';
import { CONSTANT } from 'src/infrastructure/user/common/constant';
import { PairsInfoView } from 'src/application/user/view';
import { MatchFilterDto, PairsFilterDto } from 'src/domain/user/repository/dto';
import { ImageFileTypeValidator, User } from '../common';
import { OptionalValidationPipe } from '../common';

@Controller('user')
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

  private readonly logger = new Logger(UserController.name);

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.queries.getUser(userId);

    if (!userAggregate) {
      throw new NotFoundException();
    }

    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async patch(
    @User(ParseUUIDPipe) userId: string,
    @Body(OptionalValidationPipe) dto: PatchUserDto,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.patchUser(userId, dto);
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Patch('place')
  @HttpCode(HttpStatus.OK)
  async patchPlace(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: PatchUserPlaceDto,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.patchUserPlace(
      userId,
      dto,
    );
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Get('match')
  @HttpCode(HttpStatus.OK)
  async getMatchUser(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: MatchFilterDto,
  ): Promise<ShortUser[]> {
    const userAggregates = await this.facade.queries.getMatch(userId, query);
    return userAggregates.map((user) => this.mapper.getShortUser(user));
  }

  @Post('picture')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('picture'))
  async savePicture(
    @User(ParseUUIDPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: CONSTANT.ONE_MB_SIZE }),
          new ImageFileTypeValidator(),
        ],
      }),
    )
    picture: Express.Multer.File,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.savePicture(
      userId,
      picture,
    );
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Put('picture/mix')
  @HttpCode(HttpStatus.OK)
  async mixPictures(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: MixPicturesDto,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.mixPictures(userId, dto);
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Put('picture/:id')
  @HttpCode(HttpStatus.OK)
  async deletePicture(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) pictureId: string,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.deletePicture(
      userId,
      pictureId,
    );
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  async likeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) pairId: string,
  ): Promise<ShortUser> {
    const userAggregate = await this.facade.commands.likeUser(userId, pairId);

    return this.mapper.getShortUser(userAggregate);
  }

  @Post('dislike/:id')
  @HttpCode(HttpStatus.OK)
  async dislikeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) pairId: string,
  ): Promise<ShortUser> {
    const userAggregate = await this.facade.commands.dislikeUser(
      userId,
      pairId,
    );

    return this.mapper.getShortUser(userAggregate);
  }

  @Put('return')
  @HttpCode(HttpStatus.OK)
  async returnUser(@User(ParseUUIDPipe) userId: string): Promise<ShortUser> {
    const returnedUserAggregate = await this.facade.commands.returnUser(userId);

    return this.mapper.getShortUser(returnedUserAggregate);
  }

  @Get('pairs')
  @HttpCode(HttpStatus.OK)
  async getPairs(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PairsFilterDto,
  ): Promise<ShortUser[]> {
    const pairsWithDistance = await this.facade.queries.getPairs(userId, query);

    const pairs = pairsWithDistance.map((pair) => {
      return this.mapper.getShortUser(pair);
    });

    return pairs;
  }

  @Get('pairs/info')
  @HttpCode(HttpStatus.OK)
  getPairsInfo(@User(ParseUUIDPipe) userId: string): Promise<PairsInfoView> {
    return this.facade.queries.getPairsInfo(userId);
  }

  @Post('pairs/:id')
  @HttpCode(HttpStatus.OK)
  async acceptPair(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) pairId: string,
  ): Promise<ShortUser> {
    const pair = await this.facade.commands.acceptPair(userId, pairId);
    return this.mapper.getShortUser(pair);
  }

  @Put('pairs/:id')
  @HttpCode(HttpStatus.OK)
  async deletePair(
    @User(ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) pairId: string,
  ): Promise<ShortUser> {
    const pair = await this.facade.commands.deletePair(userId, pairId);
    return this.mapper.getShortUser(pair);
  }

  // for dev
  @Patch('removeAllPairs')
  @HttpCode(HttpStatus.OK)
  removeAllPairs(@User(ParseUUIDPipe) userId: string) {
    return this.facade.dev.removeAllPairsDEV(userId);
  }

  // for dev
  @Post('createPairs')
  @HttpCode(HttpStatus.OK)
  createPairs(@User(ParseUUIDPipe) userId: string) {
    return this.facade.dev.createPairsDEV(userId);
  }
}
