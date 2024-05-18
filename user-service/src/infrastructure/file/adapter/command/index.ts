export { SavePictureCommand, SavePictureCommandHandler } from './save-picture';
export {
  DeletePictureCommand,
  DeletePictureCommandHandler,
} from './delete-picture';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommandHandler } from './save-picture';
import { DeletePictureCommandHandler } from './delete-picture';

export const FILE_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  SavePictureCommandHandler,
  DeletePictureCommandHandler,
];
