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
import {
  DeletePictureDto,
  UserDto,
  MixPicturesDto,
  ValidatedUserDto,
  NotValidatedUserDto,
} from './legacy/dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AcceptPairCommand,
  CreatePairsCommand,
  DeletePairCommand,
  DeletePictureCommand,
  DislikeUserCommand,
  MixPicturesCommand,
  RemoveAllPairsCommand,
  ReturnUserCommand,
  SavePictureCommand,
} from './legacy/commands';
import { CustomValidationPipe, OptionalValidationPipe } from 'common/pipes';
import { ONE_MB_SIZE } from 'common/constants';
import { User } from 'common/decorators';
import { UserFacade } from './application-services';
import {
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
  savePicture(
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
  ): Promise<UserDto> {
    return this.commandBus.execute(new SavePictureCommand(user, picture));
  }

  @Put('picture')
  @HttpCode(HttpStatus.OK)
  deletePicture(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body() dto: DeletePictureDto,
  ): Promise<UserDto> {
    return this.commandBus.execute(new DeletePictureCommand(user, dto));
  }

  @Put('picture/mix')
  @HttpCode(HttpStatus.OK)
  mixPictures(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body() dto: MixPicturesDto,
  ): Promise<UserDto> {
    return this.commandBus.execute(new MixPicturesCommand(user, dto));
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
    @Param('id') userPairId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DislikeUserCommand(user, userPairId));
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
  acceptPair(
    @User(CustomValidationPipe) user: ValidatedUserDto,
    @Param('id') userPairId: string,
  ): Promise<ShortUser[]> {
    return this.commandBus.execute(new AcceptPairCommand(user, userPairId));
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
