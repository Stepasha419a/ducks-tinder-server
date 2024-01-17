import { ShortUser } from 'apps/user/src/infrastructure/mapper/interface/short-user';
import { ChatMessage } from './chat-message';

export interface ShortMessagesPagination {
  chatId: string;
  users: ShortUser[];
  messages: ChatMessage[];
}
