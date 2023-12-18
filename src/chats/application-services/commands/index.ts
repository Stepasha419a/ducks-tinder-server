export { CreateChatCommand, CreateChatCommandHandler } from './create-chat';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { CreateChatCommandHandler } from './create-chat';

export const CHAT_COMMAND_HANDLERS: Type<IQueryHandler>[] = [
  CreateChatCommandHandler,
];
