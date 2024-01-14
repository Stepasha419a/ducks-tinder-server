import { User } from 'user/domain';
import { ChatMessage } from '../message';

export interface MessagesPagination {
  chatId: string;
  users: User[];
  messages: ChatMessage[];
}
