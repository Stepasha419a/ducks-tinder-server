import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GRPC_SERVICE,
  getGrpcPackageServiceName,
} from 'src/infrastructure/grpc/service';
import {
  DeleteFileRequest,
  DeleteFileResponse,
  FileProtoService,
  UploadFileRequest,
  UploadFileResponse,
} from 'src/infrastructure/grpc/service/file/file.proto-service';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { JwtService, ServiceTokenView } from 'src/domain/service/jwt';
import { UploadFileType } from 'src/domain/service/file';

@Injectable()
export class FileServiceAdapter implements OnModuleInit {
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

    return firstValueFrom(
      this.fileGrpcService.uploadFile(req, this.getMetadata()),
    );
  }

  deleteFile(filename: string): Promise<DeleteFileResponse> {
    const req: DeleteFileRequest = { filename };

    return firstValueFrom(
      this.fileGrpcService.deleteFile(req, this.getMetadata()),
    );
  }
}
