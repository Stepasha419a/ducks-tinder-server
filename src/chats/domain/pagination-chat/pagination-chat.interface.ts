import { ChatMessage } from '../message';
import { Chat } from '../chat.interface';
import { ChatVisit } from '../chat-visit';

export interface PaginationChat extends Chat {
  name: string;
  avatar?: string;
  lastMessage?: ChatMessage;
  chatVisit?: ChatVisit;
}
