import { ShortUser } from 'user/domain';
import { ChatMessage } from '../message';

export interface MessagesPagination {
  chatId: string;
  users: ShortUser[];
  messages: ChatMessage[];
}
