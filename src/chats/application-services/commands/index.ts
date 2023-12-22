export { CreateChatCommand, CreateChatCommandHandler } from './create-chat';
export { SendMessageCommand, SendMessageCommandHandler } from './send-message';

export * from './dto';
export * from './output-interface';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { CreateChatCommandHandler } from './create-chat';
import { SendMessageCommandHandler } from './send-message';

export const CHAT_COMMAND_HANDLERS: Type<IQueryHandler>[] = [
  CreateChatCommandHandler,
  SendMessageCommandHandler,
];
