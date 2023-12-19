import { Message } from '../message';
import { Chat } from '../chat.interface';

export interface PaginationChat extends Chat {
  name: string;
  avatar?: string;
  lastMessage?: Message;
}
