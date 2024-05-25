import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePictureCommand } from './delete-picture.command';
import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { firstValueFrom } from 'rxjs';
import { SERVICE } from 'src/infrastructure/rabbitmq/service';
import { ClientProxy } from '@nestjs/microservices';
import { ERROR } from 'src/infrastructure/user/common/constant';

interface SuccessDeleteFile {
  filename: string;
}

interface FailDeleteFile {
  message: string;
}

@CommandHandler(DeletePictureCommand)
export class DeletePictureCommandHandler
  implements ICommandHandler<DeletePictureCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(SERVICE.FILE) private readonly fileClient: ClientProxy,
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

    const response = await firstValueFrom<SuccessDeleteFile | FailDeleteFile>(
      this.fileClient.send('delete_file', {
        filename: existingPicture.name,
      }),
    );

    if ('message' in response) {
      throw new InternalServerErrorException(ERROR.FAILED_TO_DELETE_PICTURE);
    }

    await userAggregate.deletePicture(pictureId);

    const savedUser = await this.repository.save(userAggregate);

    return savedUser;
  }
}
