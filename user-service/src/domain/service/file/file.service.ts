import { SuccessDeleteFile, SuccessUploadFile } from './view';

export abstract class FileService {
  abstract uploadFile(
    file: Express.Multer.File,
    type: UploadFileType,
  ): Promise<SuccessUploadFile>;
  abstract deleteFile(filename: string): Promise<SuccessDeleteFile>;
}

export enum UploadFileType {
  IMAGE = 'image',
}
