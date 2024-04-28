import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommand } from './save-picture.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { ERROR } from 'apps/user/src/infrastructure/user/common/constant';
import { FileAdapter } from '@app/common/file/adapter';
import { PictureAggregate } from 'apps/user/src/domain/user/aggregate';

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

    const userAggregate = await this.repository.findOne(userId);
    if (userAggregate.pictures.length > 8) {
      throw new BadRequestException(ERROR.MAX_PICTURES_COUNT);
    }

    const fileName = await this.fileAdapter.savePicture(picture);

    const pictureAggregate = PictureAggregate.create({
      name: fileName,
      userId,
      order: userAggregate.pictures.length,
    });

    await userAggregate.addPicture(pictureAggregate);

    const updatedUser = await this.repository.save(userAggregate);

    return updatedUser;
  }
}
