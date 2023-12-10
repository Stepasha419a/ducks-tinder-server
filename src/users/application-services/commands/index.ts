export { CreateUserCommand, CreateUserCommandHandler } from './create-user';
export { PatchUserCommand, PatchUserCommandHandler } from './patch-user';
export {
  PatchUserPlaceCommand,
  PatchUserPlaceCommandHandler,
} from './patch-user-place';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { PatchUserCommandHandler } from './patch-user';
import { PatchUserPlaceCommandHandler } from './patch-user-place';

export const USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  PatchUserCommandHandler,
  PatchUserPlaceCommandHandler,
];
