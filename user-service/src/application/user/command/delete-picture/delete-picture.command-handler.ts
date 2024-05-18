import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePictureCommand } from './delete-picture.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { FileAdapter } from '@app/common/file/adapter';

@CommandHandler(DeletePictureCommand)
export class DeletePictureCommandHandler
  implements ICommandHandler<DeletePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly fileAdapter: FileAdapter,
  ) {}

  async execute(command: DeletePictureCommand): Promise<UserAggregate> {
    const { userId, pictureId } = command;

    const userAggregate = await this.repository.findOne(userId);

    const existingPicture = userAggregate.pictures.find(
      (picture) => picture.id === pictureId,
    );

    if (!existingPicture) {
      throw new NotFoundException();
    }

    await this.fileAdapter.deletePicture(existingPicture.name);
    await userAggregate.deletePicture(pictureId);

    const savedUser = await this.repository.save(userAggregate);

    return savedUser;
  }
}
