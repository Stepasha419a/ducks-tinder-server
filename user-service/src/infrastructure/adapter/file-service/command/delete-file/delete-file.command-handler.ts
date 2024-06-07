import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from './delete-file.command';
import { SuccessDeleteFile } from 'src/domain/service/file';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { FileGrpcService } from 'src/infrastructure/grpc/service/file';

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler
  implements ICommandHandler<DeleteFileCommand>
{
  constructor(private readonly fileGrpcService: FileGrpcService) {}

  private readonly logger = new Logger(DeleteFileCommandHandler.name);

  async execute(command: DeleteFileCommand): Promise<SuccessDeleteFile> {
    const response = await this.fileGrpcService
      .deleteFile(command)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(ERROR.FAILED_TO_DELETE_PICTURE);
      });

    return response;
  }
}
