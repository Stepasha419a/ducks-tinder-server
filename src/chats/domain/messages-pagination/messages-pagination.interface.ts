import { ShortUser } from 'users/domain';
import { ChatMessage } from '../message';

export interface MessagesPagination {
  chatId: string;
  users: ShortUser[];
  messages: ChatMessage[];
}
