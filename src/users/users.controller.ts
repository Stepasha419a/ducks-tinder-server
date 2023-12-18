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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShortUser } from './users.interface';
import { ValidatedUserDto, NotValidatedUserDto } from './legacy/dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreatePairsCommand,
  DeletePairCommand,
  RemoveAllPairsCommand,
  ReturnUserCommand,
} from './legacy/commands';
import { CustomValidationPipe, OptionalValidationPipe } from 'common/pipes';
import { ONE_MB_SIZE } from 'common/constants';
import { User } from 'common/decorators';
import { UserFacade } from './application-services';
import {
  MixPicturesDto,
  PatchUserDto,
  PatchUserPlaceDto,
} from './application-services/commands';
import { ResponseUser, ShortUserWithDistance } from './domain';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly facade: UserFacade,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async patch(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body(OptionalValidationPipe) dto: PatchUserDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.patchUser(user.id, dto);
    return userAggregate.getResponseUser();
  }

  @Patch('place')
  @HttpCode(HttpStatus.OK)
  async patchPlace(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body() dto: PatchUserPlaceDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.patchUserPlace(
      user.id,
      dto,
    );
    return userAggregate.getResponseUser();
  }

  @Get('sorted')
  @HttpCode(HttpStatus.OK)
  async getSortedUser(
    @User(CustomValidationPipe) user: ValidatedUserDto,
  ): Promise<ShortUserWithDistance> {
    const userAggregate = await this.facade.queries.getSorted(user.id);
    return userAggregate.getShortUserWithDistance();
  }

  @Post('picture')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('picture'))
  async savePicture(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
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
      user.id,
      picture,
    );
    return userAggregate.getResponseUser();
  }

  @Put('picture/mix')
  @HttpCode(HttpStatus.OK)
  async mixPictures(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body() dto: MixPicturesDto,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.mixPictures(user.id, dto);
    return userAggregate.getResponseUser();
  }

  @Put('picture/:id')
  @HttpCode(HttpStatus.OK)
  async deletePicture(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Param('id') pictureId: string,
  ): Promise<ResponseUser> {
    const userAggregate = await this.facade.commands.deletePicture(
      user.id,
      pictureId,
    );
    return userAggregate.getResponseUser();
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  likeUser(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') pairId: string,
  ): Promise<void> {
    return this.facade.commands.likeUser(user.id, pairId);
  }

  @Post('dislike/:id')
  @HttpCode(HttpStatus.OK)
  dislikeUser(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') pairId: string,
  ): Promise<void> {
    return this.facade.commands.dislikeUser(user.id, pairId);
  }

  @Put('return')
  @HttpCode(HttpStatus.OK)
  returnUser(
    @User(CustomValidationPipe) user: ValidatedUserDto,
  ): Promise<void> {
    return this.commandBus.execute(new ReturnUserCommand(user));
  }

  @Get('pairs')
  @HttpCode(HttpStatus.OK)
  async getPairs(
    @User(CustomValidationPipe) user: ValidatedUserDto,
  ): Promise<ShortUserWithDistance[]> {
    const pairsWithDistance = await this.facade.queries.getPairs(user.id);

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
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') pairId: string,
  ): Promise<ShortUserWithDistance> {
    const pairAggregate = await this.facade.commands.acceptPair(
      user.id,
      pairId,
    );

    return pairAggregate.getShortUserWithDistance();
  }

  @Put('pairs/:id')
  @HttpCode(HttpStatus.OK)
  deletePair(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') userPairId: string,
  ): Promise<ShortUser[]> {
    return this.commandBus.execute(new DeletePairCommand(user, userPairId));
  }

  // for dev
  @Patch('removeAllPairs')
  @HttpCode(HttpStatus.OK)
  removeAllPairs(@User() user) {
    return this.commandBus.execute(new RemoveAllPairsCommand(user));
  }

  // for dev
  @Post('createPairs')
  @HttpCode(HttpStatus.OK)
  createPairs(@User() user) {
    return this.commandBus.execute(new CreatePairsCommand(user));
  }
}
