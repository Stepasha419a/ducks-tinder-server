export { SendMessageCommand, SendMessageCommandHandler } from './send-message';
export { EditMessageCommand, EditMessageCommandHandler } from './edit-message';
export {
  DeleteMessageCommand,
  DeleteMessageCommandHandler,
} from './delete-message';
export { BlockChatCommand, BlockChatCommandHandler } from './block-chat';
export { UnblockChatCommand, UnblockChatCommandHandler } from './unblock-chat';
export {
  SaveLastSeenCommand,
  SaveLastSeenCommandHandler,
} from './save-last-seen';
export { CreateChatCommand, CreateChatCommandHandler } from './create-chat';
export { DeleteChatCommand, DeleteChatCommandHandler } from './delete-chat';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommandHandler } from './send-message';
import { EditMessageCommandHandler } from './edit-message';
import { DeleteMessageCommandHandler } from './delete-message';
import { BlockChatCommandHandler } from './block-chat';
import { UnblockChatCommandHandler } from './unblock-chat';
import { SaveLastSeenCommandHandler } from './save-last-seen';
import { CreateChatCommandHandler } from './create-chat';
import { DeleteChatCommandHandler } from './delete-chat';

export const CHAT_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  SendMessageCommandHandler,
  EditMessageCommandHandler,
  DeleteMessageCommandHandler,
  BlockChatCommandHandler,
  UnblockChatCommandHandler,
  SaveLastSeenCommandHandler,
  CreateChatCommandHandler,
  DeleteChatCommandHandler,
];
