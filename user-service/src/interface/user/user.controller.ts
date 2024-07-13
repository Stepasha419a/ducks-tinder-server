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
  HttpException,
  NotFoundException,
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
import { User, Util } from '../common';
import { OptionalValidationPipe } from '../common';
import { MetricsService } from 'src/infrastructure/metrics';

@Controller('user')
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
    private readonly metricService: MetricsService,
  ) {}

  private readonly logger = new Logger(UserController.name);

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<WithoutPrivateFields> {
    await this.metricService.incrementCounter();

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
  async getMatchUser(@User(ParseUUIDPipe) userId: string): Promise<ShortUser> {
    const userAggregate = await this.facade.queries.getMatch(userId);
    return this.mapper.getShortUser(userAggregate);
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
  async likeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
  ): Promise<ShortUser> {
    const userAggregate = await this.facade.commands.likeUser(userId, pairId);

    return this.mapper.getShortUser(userAggregate);
  }

  @Post('dislike/:id')
  @HttpCode(HttpStatus.OK)
  async dislikeUser(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
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
    const userCheckAggregate = await this.facade.commands.returnUser(userId);
    const returnedMatchUser = await this.facade.queries.getMatch(
      userId,
      userCheckAggregate.checkedId,
    );

    return this.mapper.getShortUser(returnedMatchUser);
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
    @Param('id') pairId: string,
  ): Promise<ShortUser> {
    const pair = await this.facade.commands.acceptPair(userId, pairId);
    return this.mapper.getShortUser(pair);
  }

  @Put('pairs/:id')
  @HttpCode(HttpStatus.OK)
  async deletePair(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pairId: string,
  ): Promise<ShortUser> {
    const pair = await this.facade.commands.deletePair(userId, pairId);
    return this.mapper.getShortUser(pair);
  }

  @EventPattern('create_user')
  async createUser(@Payload() dto: CreateUserDto, @Ctx() context: RmqContext) {
    const savedUser = await this.facade.commands
      .createUser(dto)
      .catch((err: HttpException) => {
        this.logger.error(err, err.stack);
      });

    if (savedUser) {
      Util.ackMessage(context);
    }
  }

  @MessagePattern('get_many_users')
  async getManyUsers(
    @Payload() ids: string[],
    @Ctx() context: RmqContext,
  ): Promise<UserAggregate[]> {
    const users = await this.facade.queries
      .getManyUsers(ids)
      .catch((err: HttpException) => {
        this.logger.error(err, err.stack);
      });

    Util.ackMessage(context);

    return users || [];
  }

  @MessagePattern('get_short_user')
  async getUser(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ): Promise<ShortUser> {
    const user = await this.facade.queries
      .getUser(id)
      .catch((err: HttpException) => {
        this.logger.error(err, err.stack);
      });

    Util.ackMessage(context);

    if (!user) {
      return null;
    }

    return this.mapper.getShortUser(user);
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
