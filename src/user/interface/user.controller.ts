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
import { OptionalValidationPipe } from 'common/pipes';
import { ONE_MB_SIZE } from 'common/constants';
import { User } from 'common/decorators';
import { UserFacade } from '../application';
import {
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceDto,
} from '../application/command';
import { ResponseUser, ShortUserWithDistance } from '../domain';

@Controller('user')
export class UserController {
  constructor(private readonly facade: UserFacade) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async patch(
    @User(ParseUUIDPipe) userId: string,
    @Body(OptionalValidationPipe) dto: PatchUserDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.patchUser(userId, dto);
    return userAggregate.getResponseUser();
  }

  @Patch('place')
  @HttpCode(HttpStatus.OK)
  async patchPlace(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: PatchUserPlaceDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.patchUserPlace(
      userId,
      dto,
    );
    return userAggregate.getResponseUser();
  }

  @Get('sorted')
  @HttpCode(HttpStatus.OK)
  async getSortedUser(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<ShortUserWithDistance> {
    const userAggregate = await this.facade.queries.getSorted(userId);
    return userAggregate.getShortUserWithDistance();
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
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.savePicture(
      userId,
      picture,
    );
    return userAggregate.getResponseUser();
  }

  @Put('picture/mix')
  @HttpCode(HttpStatus.OK)
  async mixPictures(
    @User(ParseUUIDPipe) userId: string,
    @Body() dto: MixPicturesDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.mixPictures(userId, dto);
    return userAggregate.getResponseUser();
  }

  @Put('picture/:id')
  @HttpCode(HttpStatus.OK)
  async deletePicture(
    @User(ParseUUIDPipe) userId: string,
    @Param('id') pictureId: string,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.deletePicture(
      userId,
      pictureId,
    );
    return userAggregate.getResponseUser();
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

    return returnedSortedUser.getShortUserWithDistance();
  }

  @Get('pairs')
  @HttpCode(HttpStatus.OK)
  async getPairs(
    @User(ParseUUIDPipe) userId: string,
  ): Promise<ShortUserWithDistance[]> {
    const pairsWithDistance = await this.facade.queries.getPairs(userId);

    const pairs = await Promise.all(
      pairsWithDistance.map((pair) => {
        return pair.getShortUserWithDistance();
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
