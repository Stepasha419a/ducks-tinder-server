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
import { Metadata } from '@grpc/grpc-js';
import { JwtService, ServiceTokenView } from 'src/domain/service/jwt';

@Injectable()
export class FileGrpcService implements OnModuleInit {
  private fileGrpcService: FileProtoService;
  private serviceToken: ServiceTokenView;
  private metadata: Metadata;

  constructor(
    @Inject(GRPC_SERVICE.FILE) private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.fileGrpcService = this.client.getService<FileProtoService>(
      getGrpcPackageServiceName(GRPC_SERVICE.FILE),
    );
  }

  private getMetadata(): Metadata {
    if (!this.metadata) {
      this.metadata = new Metadata();
    }

    if (!this.serviceToken || this.serviceToken.expiresIn < new Date()) {
      this.serviceToken = this.jwtService.generateFileServiceToken();
      this.metadata.set('authorization', this.serviceToken.accessToken);
    }

    return this.metadata;
  }

  uploadFile(req: UploadFileRequest): Promise<UploadFileResponse> {
    return firstValueFrom(
      this.fileGrpcService.uploadFile(req, this.getMetadata()),
    );
  }

  deleteFile(req: DeleteFileRequest): Promise<DeleteFileResponse> {
    return firstValueFrom(
      this.fileGrpcService.deleteFile(req, this.getMetadata()),
    );
  }
}
