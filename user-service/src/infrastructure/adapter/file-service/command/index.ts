export { UploadFileCommand, UploadFileCommandHandler } from './upload-file';
export { DeleteFileCommand, DeleteFileCommandHandler } from './delete-file';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommandHandler } from './upload-file';
import { DeleteFileCommandHandler } from './delete-file';

export const FILE_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  UploadFileCommandHandler,
  DeleteFileCommandHandler,
];
