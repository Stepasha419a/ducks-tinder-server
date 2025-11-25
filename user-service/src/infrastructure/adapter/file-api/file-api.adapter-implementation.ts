import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  DeleteFileRequest,
  DeleteFileResponse,
  FileProtoService,
  GRPC_SERVICE,
  UploadFileRequest,
  UploadFileResponse,
  getGrpcPackageServiceName,
} from 'src/infrastructure/grpc/service';
import { firstValueFrom } from 'rxjs';
import { UploadFileType } from 'src/application/user/adapter/file-api';

@Injectable()
export class FileApiImplementation implements OnModuleInit {
  private fileGrpcService: FileProtoService;

  constructor(@Inject(GRPC_SERVICE.FILE) private readonly client: ClientGrpc) {}

  private readonly logger = new Logger(FileApiImplementation.name);

  onModuleInit() {
    this.fileGrpcService = this.client.getService<FileProtoService>(
      getGrpcPackageServiceName(GRPC_SERVICE.FILE),
    );
  }

  async uploadFile(
    file: Express.Multer.File | File,
    type: UploadFileType,
  ): Promise<UploadFileResponse> {
    let data: string;
    if ('buffer' in file) {
      data = file.buffer.toString('base64');
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      data = buffer.toString('base64');
    }

    const req: UploadFileRequest = {
      data,
      type: type,
    };

    return firstValueFrom(this.fileGrpcService.uploadFile(req)).catch((err) => {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException();
    });
  }

  deleteFile(filename: string): Promise<DeleteFileResponse> {
    const req: DeleteFileRequest = { filename };

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
