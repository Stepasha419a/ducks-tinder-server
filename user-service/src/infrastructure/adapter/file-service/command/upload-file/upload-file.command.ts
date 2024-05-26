import { UploadFileType } from 'src/domain/service/file';

export class UploadFileCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly type: UploadFileType,
  ) {}
}
