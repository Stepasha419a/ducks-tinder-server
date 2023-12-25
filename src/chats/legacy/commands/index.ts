export { BlockChatCommand } from './block-chat';
export { UnblockChatCommand } from './unblock-chat';
export { DeleteChatCommand } from './delete-chat';
export { SaveLastSeenCommand } from './save-last-seen';

import { BlockChatCommandHandler } from './block-chat';
import { UnblockChatCommandHandler } from './unblock-chat';
import { DeleteChatCommandHandler } from './delete-chat';
import { SaveLastSeenCommandHandler } from './save-last-seen';

export const ChatCommandHandlers = [
  BlockChatCommandHandler,
  UnblockChatCommandHandler,
  DeleteChatCommandHandler,
  SaveLastSeenCommandHandler,
];
