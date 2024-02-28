import { ChatVisitValueObject } from 'apps/chat/src/domain/value-object';
import { ShortUserMessage } from './short-user-message';

export interface ShortChatPagination {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: ShortUserMessage;
  chatVisit?: ChatVisitValueObject;
  blocked: boolean;
  blockedById?: string;
}
