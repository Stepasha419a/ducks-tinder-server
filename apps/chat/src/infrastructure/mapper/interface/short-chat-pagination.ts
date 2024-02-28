import { ChatVisitValueObject } from 'apps/chat/src/domain/value-object';
import { ShortMessage } from './short-user-message';

export interface ShortChatPagination {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: ShortMessage;
  chatVisit?: ChatVisitValueObject;
  blocked: boolean;
  blockedById?: string;
}
