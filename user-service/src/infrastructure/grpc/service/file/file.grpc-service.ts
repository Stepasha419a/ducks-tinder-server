import {
  DeleteFileRequest,
  DeleteFileResponse,
  UploadFileRequest,
  UploadFileResponse,
} from './file.proto-service';

export abstract class FileGrpcService {
  abstract uploadFile(req: UploadFileRequest): Promise<UploadFileResponse>;
  abstract deleteFile(req: DeleteFileRequest): Promise<DeleteFileResponse>;
}
