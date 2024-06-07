import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  ClientGrpc,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  GRPC_SERVICE,
  getGrpcPackageName,
  getGrpcPackageServiceName,
} from '../service';
import {
  DeleteFileRequest,
  DeleteFileResponse,
  FileProtoService,
  UploadFileRequest,
  UploadFileResponse,
} from './file.proto-service';
import { firstValueFrom } from 'rxjs';
import { FileGrpcService } from './file.grpc-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileGrpcServiceAdapter implements OnModuleInit, FileGrpcService {
  constructor(private readonly configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: getGrpcPackageName(GRPC_SERVICE.FILE),
        protoPath: `proto/${getGrpcPackageName(GRPC_SERVICE.FILE)}.proto`,
        url: configService.get(`${GRPC_SERVICE.FILE}_URL`),
      },
    });
  }

  client: ClientGrpc;

  private fileGrpcService: FileProtoService;

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
