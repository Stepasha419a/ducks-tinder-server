export { DeleteChatCommand } from './delete-chat';
export { SaveLastSeenCommand } from './save-last-seen';

import { DeleteChatCommandHandler } from './delete-chat';
import { SaveLastSeenCommandHandler } from './save-last-seen';

export const ChatCommandHandlers = [
  DeleteChatCommandHandler,
  SaveLastSeenCommandHandler,
];
