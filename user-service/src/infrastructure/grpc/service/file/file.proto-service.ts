import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface FileProtoService {
  uploadFile(
    req: UploadFileRequest,
    metadata: Metadata,
  ): Observable<UploadFileResponse>;
  deleteFile(
    req: DeleteFileRequest,
    metadata: Metadata,
  ): Observable<DeleteFileResponse>;
}

export interface UploadFileRequest {
  data: string;
  type: string;
}

export interface UploadFileResponse {
  filename: string;
}

export interface DeleteFileRequest {
  filename: string;
}

export interface DeleteFileResponse {
  filename: string;
}
