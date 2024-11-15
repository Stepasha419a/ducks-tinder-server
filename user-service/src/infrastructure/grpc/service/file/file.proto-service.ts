import { Observable } from 'rxjs';

export interface FileProtoService {
  uploadFile(req: UploadFileRequest): Observable<UploadFileResponse>;
  deleteFile(req: DeleteFileRequest): Observable<DeleteFileResponse>;
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
