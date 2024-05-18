import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommand } from './save-picture.command';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { PictureEntity } from 'src/domain/user/entity';
import { FileAdapter } from 'src/infrastructure/file/adapter';

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

    const pictureAggregate = PictureEntity.create({
      name: fileName,
      userId,
      order: userAggregate.pictures.length,
    });

    await userAggregate.addPicture(pictureAggregate);

    const updatedUser = await this.repository.save(userAggregate);

    return updatedUser;
  }
}
