export { CreateUserCommand, CreateUserCommandHandler } from './create-user';
export { PatchUserCommand, PatchUserCommandHandler } from './patch-user';
export {
  PatchUserPlaceCommand,
  PatchUserPlaceCommandHandler,
} from './patch-user-place';
export { LikeUserCommand, LikeUserCommandHandler } from './like-user';
export { DislikeUserCommand, DislikeUserCommandHandler } from './dislike-user';
export { SavePictureCommand, SavePictureCommandHandler } from './save-picture';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { PatchUserCommandHandler } from './patch-user';
import { PatchUserPlaceCommandHandler } from './patch-user-place';
import { LikeUserCommandHandler } from './like-user';
import { DislikeUserCommandHandler } from './dislike-user';
import { SavePictureCommandHandler } from './save-picture';

export const USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  PatchUserCommandHandler,
  PatchUserPlaceCommandHandler,
  LikeUserCommandHandler,
  DislikeUserCommandHandler,
  SavePictureCommandHandler,
];
