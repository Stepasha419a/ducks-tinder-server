import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilesService } from 'files/files.service';
import { SavePictureCommand } from './save-picture.command';
import { MAX_PICTURES_COUNT } from 'common/constants/error';
import { UserRepository } from 'users/providers';
import { PictureAggregate } from 'users/domain/picture';
import { UserAggregate } from 'users/domain';

@CommandHandler(SavePictureCommand)
export class SavePictureCommandHandler
  implements ICommandHandler<SavePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async execute(command: SavePictureCommand): Promise<UserAggregate> {
    const { userId, picture } = command;

    const pictures = await this.repository.findPictures(userId);
    if (pictures.length > 8) {
      throw new BadRequestException(MAX_PICTURES_COUNT);
    }

    const fileName = await this.filesService.savePicture(picture, userId);

    const userAggregate = await this.repository.findOne(userId);

    const pictureAggregate = PictureAggregate.create({
      name: fileName,
      userId,
      order: pictures.length,
    });

    await userAggregate.addPicture(pictureAggregate);

    const updatedUser = await this.repository.save(userAggregate);

    return updatedUser;
  }
}
