export { UnblockChatCommand } from './unblock-chat';
export { DeleteChatCommand } from './delete-chat';
export { SaveLastSeenCommand } from './save-last-seen';

import { UnblockChatCommandHandler } from './unblock-chat';
import { DeleteChatCommandHandler } from './delete-chat';
import { SaveLastSeenCommandHandler } from './save-last-seen';

export const ChatCommandHandlers = [
  UnblockChatCommandHandler,
  DeleteChatCommandHandler,
  SaveLastSeenCommandHandler,
];
