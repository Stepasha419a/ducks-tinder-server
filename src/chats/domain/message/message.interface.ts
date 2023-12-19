import { RepliedMessage } from './replied-message';

export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  repliedId?: RepliedMessage;

  createdAt: string;
  updatedAt: string;
}
