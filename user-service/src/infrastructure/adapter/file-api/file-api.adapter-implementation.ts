import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GRPC_SERVICE,
  getGrpcPackageServiceName,
} from 'src/infrastructure/grpc/service';
import { firstValueFrom } from 'rxjs';
import { UploadFileType } from 'src/application/user/adapter/file-api';
import { file } from 'src/infrastructure/grpc/gen';

@Injectable()
export class FileApiImplementation implements OnModuleInit {
  private fileGrpcService: file.FileService;

  constructor(@Inject(GRPC_SERVICE.FILE) private readonly client: ClientGrpc) {}

  private readonly logger = new Logger(FileApiImplementation.name);

  onModuleInit() {
    this.fileGrpcService = this.client.getService<file.FileService>(
      getGrpcPackageServiceName(GRPC_SERVICE.FILE),
    );
  }

  async uploadFile(
    file: Express.Multer.File | File,
    type: UploadFileType,
  ): Promise<file.UploadFileResponse> {
    let data: Uint8Array<ArrayBuffer>;
    if ('buffer' in file) {
      data = Uint8Array.from(file.buffer);
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      data = buffer;
    }

    const req: file.UploadFileRequest = {
      data,
      type: type,
    };

    return firstValueFrom(this.fileGrpcService.uploadFile(req)).catch((err) => {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException();
    });
  }

  deleteFile(filename: string): Promise<file.DeleteFileResponse> {
    const req: file.DeleteFileRequest = { filename };

    return firstValueFrom(this.fileGrpcService.deleteFile(req)).catch((err) => {
      this.logger.error(
        'Failed to handle grpc request',
        err.message,
        err.stack,
      );
      throw new InternalServerErrorException();
    });
  }
}
