import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteFileCommand, UploadFileCommand } from './command';
import {
  FileService,
  SuccessDeleteFile,
  SuccessUploadFile,
  UploadFileType,
} from 'src/domain/service/file';

@Injectable()
export class FileAdapter implements FileService {
  constructor(private readonly commandBus: CommandBus) {}

  uploadFile(
    file: Express.Multer.File,
    type: UploadFileType,
  ): Promise<SuccessUploadFile> {
    return this.commandBus.execute<UploadFileCommand, SuccessUploadFile>(
      new UploadFileCommand(file, type),
    );
  }

  deleteFile(filename: string): Promise<SuccessDeleteFile> {
    return this.commandBus.execute<DeleteFileCommand, SuccessDeleteFile>(
      new DeleteFileCommand(filename),
    );
  }
}
