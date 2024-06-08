import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICE, getGrpcPackageServiceName } from '../service';
import {
  DeleteFileRequest,
  DeleteFileResponse,
  FileProtoService,
  UploadFileRequest,
  UploadFileResponse,
} from './file.proto-service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FileGrpcService implements OnModuleInit {
  private fileGrpcService: FileProtoService;

  constructor(@Inject(GRPC_SERVICE.FILE) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.fileGrpcService = this.client.getService<FileProtoService>(
      getGrpcPackageServiceName(GRPC_SERVICE.FILE),
    );
  }

  uploadFile(req: UploadFileRequest): Promise<UploadFileResponse> {
    return firstValueFrom(this.fileGrpcService.uploadFile(req));
  }

  deleteFile(req: DeleteFileRequest): Promise<DeleteFileResponse> {
    return firstValueFrom(this.fileGrpcService.deleteFile(req));
  }
}
