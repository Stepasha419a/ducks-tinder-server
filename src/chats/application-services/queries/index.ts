export { GetChatsQuery, GetChatsQueryHandler } from './get-chats';
export { GetMessagesQuery, GetMessagesQueryHandler } from './get-messages';
export {
  GetChatMemberIdsQuery,
  GetChatMemberIdsQueryHandler,
} from './get-chat-member-ids';

export * from './dto';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetChatsQueryHandler } from './get-chats';
import { GetMessagesQueryHandler } from './get-messages';
import { GetChatMemberIdsQueryHandler } from './get-chat-member-ids';

export const CHAT_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetChatsQueryHandler,
  GetMessagesQueryHandler,
  GetChatMemberIdsQueryHandler,
];
