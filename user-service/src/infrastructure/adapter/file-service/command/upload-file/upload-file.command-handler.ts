import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommand } from './upload-file.command';
import { firstValueFrom } from 'rxjs';
import {
  FailedFileServiceResponse,
  SuccessUploadFile,
} from 'src/domain/service/file';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { SERVICE } from 'src/infrastructure/rabbitmq/service';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(@Inject(SERVICE.FILE) private readonly fileClient: ClientProxy) {}

  async execute(command: UploadFileCommand): Promise<SuccessUploadFile> {
    const { file, type } = command;

    const response = await firstValueFrom<
      SuccessUploadFile | FailedFileServiceResponse
    >(
      this.fileClient.send('upload_file', {
        data: file.buffer.toString('base64'),
        type: type,
      }),
    );

    if ('message' in response) {
      throw new InternalServerErrorException(ERROR.FAILED_TO_UPLOAD_PICTURE);
    }

    return response;
  }
}
