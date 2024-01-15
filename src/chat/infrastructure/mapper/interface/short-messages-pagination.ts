import { ShortUser } from 'user/infrastructure/mapper/interface/short-user';
import { ChatMessage } from './chat-message';

export interface ShortMessagesPagination {
  chatId: string;
  users: ShortUser[];
  messages: ChatMessage[];
}
