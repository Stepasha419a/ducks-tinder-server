import { ChatVisitValueObject } from 'chat/domain/value-object';
import { ShortMessage } from './short-message';

export interface ShortChatPagination {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: ShortMessage;
  chatVisit?: ChatVisitValueObject;
  blocked: boolean;
  blockedById?: string;
}
