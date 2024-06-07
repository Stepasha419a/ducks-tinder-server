import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommand } from './upload-file.command';
import { SuccessUploadFile } from 'src/domain/service/file';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { FileGrpcService } from 'src/infrastructure/grpc/service/file';

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(private readonly fileGrpcService: FileGrpcService) {}

  private readonly logger = new Logger(UploadFileCommandHandler.name);
  async execute(command: UploadFileCommand): Promise<SuccessUploadFile> {
    const { file, type } = command;

    const response = await this.fileGrpcService
      .uploadFile({
        data: file.buffer.toString('base64'),
        type: type,
      })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(ERROR.FAILED_TO_UPLOAD_PICTURE);
      });

    return response;
  }
}
