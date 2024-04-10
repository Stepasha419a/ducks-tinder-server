export { GetChatQuery, GetChatQueryHandler } from './get-chat';
export { GetChatsQuery, GetChatsQueryHandler } from './get-chats';
export { GetMessagesQuery, GetMessagesQueryHandler } from './get-messages';
export {
  GetNewMessagesCountQuery,
  GetNewMessagesCountQueryHandler,
} from './get-new-messages-count';
export {
  GetChatMemberIdsQuery,
  GetChatMemberIdsQueryHandler,
} from './get-chat-member-ids';
export {
  GetChatMemberQuery,
  GetChatMemberQueryHandler,
} from './get-chat-member';
export {
  ValidateChatMemberQuery,
  ValidateChatMemberQueryHandler,
} from './validate-chat-member';

export * from './dto';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetChatQueryHandler } from './get-chat';
import { GetChatsQueryHandler } from './get-chats';
import { GetMessagesQueryHandler } from './get-messages';
import { GetNewMessagesCountQueryHandler } from './get-new-messages-count';
import { GetChatMemberIdsQueryHandler } from './get-chat-member-ids';
import { GetChatMemberQueryHandler } from './get-chat-member';
import { ValidateChatMemberQueryHandler } from './validate-chat-member';

export const CHAT_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetChatQueryHandler,
  GetChatsQueryHandler,
  GetMessagesQueryHandler,
  GetNewMessagesCountQueryHandler,
  GetChatMemberIdsQueryHandler,
  ValidateChatMemberQueryHandler,
  GetChatMemberQueryHandler,
];
