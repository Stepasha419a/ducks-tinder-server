import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommand } from './save-picture.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { FileAdapter } from 'apps/user/src/application/adapter';
import { PictureValueObject } from 'apps/user/src/domain/user/value-object';
import { ERROR } from 'apps/user/src/infrastructure/common/constant';

@CommandHandler(SavePictureCommand)
export class SavePictureCommandHandler
  implements ICommandHandler<SavePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly fileAdapter: FileAdapter,
  ) {}

  async execute(command: SavePictureCommand): Promise<UserAggregate> {
    const { userId, picture } = command;

    const pictures = await this.repository.findManyPictures(userId);
    if (pictures.length > 8) {
      throw new BadRequestException(ERROR.MAX_PICTURES_COUNT);
    }

    const fileName = await this.fileAdapter.savePicture(picture, userId);

    const userAggregate = await this.repository.findOne(userId);

    const pictureValueObject = PictureValueObject.create({
      name: fileName,
      userId,
      order: pictures.length,
    });

    await userAggregate.addPicture(pictureValueObject);

    const updatedUser = await this.repository.save(userAggregate);

    return updatedUser;
  }
}
