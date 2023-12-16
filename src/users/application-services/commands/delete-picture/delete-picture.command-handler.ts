import { FilesService } from 'files/files.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePictureCommand } from './delete-picture.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'users/providers';
import { UserAggregate } from 'users/domain';

@CommandHandler(DeletePictureCommand)
export class DeletePictureCommandHandler
  implements ICommandHandler<DeletePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly filesService: FilesService,
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

    await this.filesService.deletePicture(existingPicture.name, userId);
    await userAggregate.deletePicture(pictureId);

    await userAggregate.sortPictureOrders(existingPicture.order);

    const savedUser = await this.repository.save(userAggregate);

    return savedUser;
  }
}
