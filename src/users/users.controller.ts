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
  LikeUserCommand,
  MixPicturesCommand,
  RemoveAllPairsCommand,
  ReturnUserCommand,
  SavePictureCommand,
} from './legacy/commands';
import { GetPairsQuery } from './legacy/queries';
import { CustomValidationPipe, OptionalValidationPipe } from 'common/pipes';
import { ONE_MB_SIZE } from 'common/constants';
import { User } from 'common/decorators';
import { UserFacade } from './application-services';
import {
  PatchUserDto,
  PatchUserPlaceDto,
} from './application-services/commands';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly facade: UserFacade,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  patch(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body(OptionalValidationPipe) dto: PatchUserDto,
  ) {
    return this.facade.commands.patchUser(user.id, dto);
  }

  @Patch('place')
  @HttpCode(HttpStatus.OK)
  patchPlace(
    @User(CustomValidationPipe) user: NotValidatedUserDto,
    @Body() dto: PatchUserPlaceDto,
  ) {
    return this.facade.commands.patchUserPlace(user.id, dto);
  }

  @Get('sorted')
  @HttpCode(HttpStatus.OK)
  getSortedUser(@User(CustomValidationPipe) user: ValidatedUserDto) {
    return this.facade.queries.getSorted(user.id);
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
    @Param('id') userPairId: string,
  ): Promise<void> {
    return this.commandBus.execute(new LikeUserCommand(user, userPairId));
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
  getPairs(
    @User(CustomValidationPipe) user: ValidatedUserDto,
  ): Promise<ShortUser[]> {
    return this.queryBus.execute(new GetPairsQuery(user));
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
