export { SavePictureCommand, SavePictureCommandHandler } from './save-picture';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { SavePictureCommandHandler } from './save-picture';

export const FILE_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  SavePictureCommandHandler,
];
