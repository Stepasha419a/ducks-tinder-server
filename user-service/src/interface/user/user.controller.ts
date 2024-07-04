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
  FileTypeValidator,
  ParseUUIDPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserFacade } from '../../application/user';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserAggregate } from '../../domain/user';
import {
  ShortUser,
  ShortUserWithDistance,
  UserMapper,
  WithoutPrivateFields,
} from '../../infrastructure/user/mapper';
import {
  CreateUserDto,
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceDto,
} from '../../application/user/command';
import { CONSTANT } from '../../infrastructure/user/common/constant';
import { PairsInfoView } from '../../application/user/view';
import { PairsFilterDto } from '../../domain/user/repository/dto';
import { User } from '../common';
import { OptionalValidationPipe } from '../common';

@Controller('user')
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

  private readonly logger = new Logger(UserController.name);

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
  ): Promise<ShortUserWithDistance> {
    const userAggregate = await this.facade.queries.getMatch(userId);
    return this.mapper.getShortUserWithDistance(userAggregate);
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
          new FileTypeValidator({ fileType: 'image/*' }),
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
    @Param('id') pictureId: string,
  ): Promise<WithoutPrivateFields> {
    const userAggregate = await this.facade.commands.deletePicture(
      userId,
      pictureId,
    );
    return this.mapper.getWithoutPrivateFields(userAggregate);
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  likeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
  ): Promise<void> {
    return this.facade.commands.likeUser(userId, pairId);
  }

  @Post('dislike/:id')
  @HttpCode(HttpStatus.OK)
  dislikeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
  ): Promise<void> {
    return this.facade.commands.dislikeUser(userId, pairId);
  }

  @Put('return')
  @HttpCode(HttpStatus.OK)
  async returnUser(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<ShortUserWithDistance> {
    const userCheckAggregate = await this.facade.commands.returnUser(userId);
    const returnedMatchUser = await this.facade.queries.getMatch(
      userId,
      userCheckAggregate.checkedId,
    );

    return this.mapper.getShortUserWithDistance(returnedMatchUser);
  }

  @Get('pairs')
  @HttpCode(HttpStatus.OK)
  async getPairs(
    @User(ParseUUIDPipe) userId: string,
    @Query()
    query: PairsFilterDto,
  ): Promise<ShortUserWithDistance[]> {
    const pairsWithDistance = await this.facade.queries.getPairs(userId, query);

    const pairs = pairsWithDistance.map((pair) => {
      return this.mapper.getShortUserWithDistance(pair);
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
    @Param('id') pairId: string,
  ): Promise<string> {
    return this.facade.commands.acceptPair(userId, pairId);
  }

  @Put('pairs/:id')
  @HttpCode(HttpStatus.OK)
  deletePair(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
  ): Promise<string> {
    return this.facade.commands.deletePair(userId, pairId);
  }

  @EventPattern('create_user')
  async createUser(@Payload() dto: CreateUserDto, @Ctx() context: RmqContext) {
    const savedUser = await this.facade.commands
      .createUser(dto)
      .catch((err) => {
        this.logger.error(err);
      });

    /* if (savedUser) {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
    } */
  }

  @MessagePattern('get_many_users')
  getManyUsers(@Payload() ids: string[]): Promise<UserAggregate[]> {
    return this.facade.queries.getManyUsers(ids);
  }

  @MessagePattern('get_short_user')
  async getUser(@Payload() id: string): Promise<ShortUser> {
    const user = await this.facade.queries.getUser(id);
    if (!user) {
      return null;
    }

    return this.mapper.getShortUserWithDistance(user);
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
