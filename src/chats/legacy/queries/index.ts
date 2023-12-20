export { GetMessagesQuery } from './get-messages';
export { ValidateChatMemberQuery } from './validate-chat-member';

import { GetMessagesQueryHandler } from './get-messages';
import { ValidateChatMemberQueryHandler } from './validate-chat-member';

export const ChatQueryHandlers = [
  GetMessagesQueryHandler,
  ValidateChatMemberQueryHandler,
];
