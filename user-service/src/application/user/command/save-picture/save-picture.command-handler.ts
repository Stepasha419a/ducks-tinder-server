import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommand } from './save-picture.command';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE } from 'src/infrastructure/rabbitmq/service';
import { firstValueFrom } from 'rxjs';
import { PictureEntity } from 'src/domain/user/entity';

interface SuccessUploadFile {
  filename: string;
}

interface FailUploadFile {
  message: string;
}

@CommandHandler(SavePictureCommand)
export class SavePictureCommandHandler
  implements ICommandHandler<SavePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(SERVICE.FILE) private readonly fileClient: ClientProxy,
  ) {}

  async execute(command: SavePictureCommand): Promise<UserAggregate> {
    const { userId, picture } = command;

    const userAggregate = await this.repository.findOne(userId);
    if (userAggregate.pictures.length > 8) {
      throw new BadRequestException(ERROR.MAX_PICTURES_COUNT);
    }

    const response = await firstValueFrom<SuccessUploadFile | FailUploadFile>(
      this.fileClient.send('upload_file', {
        data: picture.buffer.toString('base64'),
        type: 'image',
      }),
    );

    if ('message' in response) {
      throw new InternalServerErrorException(ERROR.FAILED_TO_UPLOAD_PICTURE);
    }

    const pictureAggregate = PictureEntity.create({
      name: response.filename,
      userId,
      order: userAggregate.pictures.length,
    });

    await userAggregate.addPicture(pictureAggregate);

    const updatedUser = await this.repository.save(userAggregate);

    return updatedUser;
  }
}
