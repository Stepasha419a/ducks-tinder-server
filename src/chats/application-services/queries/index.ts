export { GetChatsQuery, GetChatsQueryHandler } from './get-chats';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetChatsQueryHandler } from './get-chats';

export const CHAT_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetChatsQueryHandler,
];
