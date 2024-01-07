export { CreateChatEventHandler } from './create-chat/create-chat.event-handler';

import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';

import { CreateChatEventHandler } from './create-chat/create-chat.event-handler';

export const CHAT_EVENT_HANDLERS: Type<IEventHandler>[] = [
  CreateChatEventHandler,
];
