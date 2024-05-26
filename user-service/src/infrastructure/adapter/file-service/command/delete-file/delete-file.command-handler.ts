import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from './delete-file.command';
import { firstValueFrom } from 'rxjs';
import {
  FailedFileServiceResponse,
  SuccessDeleteFile,
} from 'src/domain/service/file';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE } from 'src/infrastructure/rabbitmq/service';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ERROR } from 'src/infrastructure/user/common/constant';

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler
  implements ICommandHandler<DeleteFileCommand>
{
  constructor(@Inject(SERVICE.FILE) private readonly fileClient: ClientProxy) {}

  async execute(command: DeleteFileCommand): Promise<SuccessDeleteFile> {
    const { filename } = command;

    const response = await firstValueFrom<
      SuccessDeleteFile | FailedFileServiceResponse
    >(
      this.fileClient.send('delete_file', {
        filename,
      }),
    );

    if ('message' in response) {
      throw new InternalServerErrorException(ERROR.FAILED_TO_DELETE_PICTURE);
    }

    return response;
  }
}
