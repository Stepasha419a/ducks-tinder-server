export { PatchUserCommand, PatchUserCommandHandler } from './patch-user';
export { CreateUserCommand, CreateUserCommandHandler } from './create-user';
export {
  PatchUserPlaceCommand,
  PatchUserPlaceCommandHandler,
} from './patch-user-place';
export { LikeUserCommand, LikeUserCommandHandler } from './like-user';
export { DislikeUserCommand, DislikeUserCommandHandler } from './dislike-user';
export { SavePictureCommand, SavePictureCommandHandler } from './save-picture';
export {
  DeletePictureCommand,
  DeletePictureCommandHandler,
} from './delete-picture';
export { MixPicturesCommand, MixPicturesCommandHandler } from './mix-pictures';
export { AcceptPairCommand, AcceptPairCommandHandler } from './accept-pair';
export { ReturnUserCommand, ReturnUserCommandHandler } from './return-user';
export { DeletePairCommand, DeletePairCommandHandler } from './delete-pair';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { PatchUserCommandHandler } from './patch-user';
import { PatchUserPlaceCommandHandler } from './patch-user-place';
import { LikeUserCommandHandler } from './like-user';
import { DislikeUserCommandHandler } from './dislike-user';
import { SavePictureCommandHandler } from './save-picture';
import { DeletePictureCommandHandler } from './delete-picture';
import { MixPicturesCommandHandler } from './mix-pictures';
import { AcceptPairCommandHandler } from './accept-pair';
import { ReturnUserCommandHandler } from './return-user';
import { DeletePairCommandHandler } from './delete-pair';

export const USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  PatchUserCommandHandler,
  PatchUserPlaceCommandHandler,
  LikeUserCommandHandler,
  DislikeUserCommandHandler,
  SavePictureCommandHandler,
  DeletePictureCommandHandler,
  MixPicturesCommandHandler,
  AcceptPairCommandHandler,
  ReturnUserCommandHandler,
  DeletePairCommandHandler,
];
