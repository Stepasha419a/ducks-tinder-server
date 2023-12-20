import { RepliedMessage } from './replied-message';

export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  replied?: RepliedMessage;

  createdAt: string;
  updatedAt: string;
}
