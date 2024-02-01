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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalValidationPipe } from '@app/common/pipes';
import { ONE_MB_SIZE } from '@app/common/constants';
import { User } from '@app/common/decorator';
import { UserFacade } from '../application';
import {
  CreateUserDto,
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceDto,
} from '../application/command';
import {
  UserMapper,
  WithoutPrivateFields,
} from 'apps/user/src/infrastructure/mapper';
import { ShortUserWithDistance } from 'apps/user/src/infrastructure/mapper/interface/short-user-with-distance';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserAggregate } from '../domain';

@Controller('user')
export class UserController {
  constructor(
    private readonly facade: UserFacade,
    private readonly mapper: UserMapper,
  ) {}

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

  @Get('sorted')
  @HttpCode(HttpStatus.OK)
  async getSortedUser(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<ShortUserWithDistance> {
    const userAggregate = await this.facade.queries.getSorted(userId);
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
          new MaxFileSizeValidator({ maxSize: ONE_MB_SIZE }),
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
    const returnedSortedUser = await this.facade.queries.getSorted(
      userId,
      userCheckAggregate.checkedId,
    );

    return this.mapper.getShortUserWithDistance(returnedSortedUser);
  }

  @Get('pairs')
  @HttpCode(HttpStatus.OK)
  async getPairs(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<ShortUserWithDistance[]> {
    const pairsWithDistance = await this.facade.queries.getPairs(userId);

    const pairs = await Promise.all(
      pairsWithDistance.map((pair) => {
        return this.mapper.getShortUserWithDistance(pair);
      }),
    );

    return pairs;
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

  @MessagePattern('get_user')
  getUser(@Payload(ParseUUIDPipe) id: string): Promise<UserAggregate> {
    return this.facade.queries.getUser(id);
  }

  @MessagePattern('get_many_users')
  getManyUsers(@Payload() ids: string[]): Promise<UserAggregate[]> {
    return this.facade.queries.getManyUsers(ids);
  }

  @MessagePattern('get_user_by_email')
  getUserByEmail(@Payload() email: string): Promise<UserAggregate> {
    return this.facade.queries.getUserByEmail(email);
  }

  @MessagePattern('create_user')
  createUser(@Payload() dto: CreateUserDto): Promise<UserAggregate> {
    return this.facade.commands.createUser(dto);
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
