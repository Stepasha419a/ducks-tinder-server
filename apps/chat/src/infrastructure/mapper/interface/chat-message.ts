import { RepliedMessage } from 'apps/chat/src/domain';

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  replied?: RepliedMessage;

  createdAt: string;
  updatedAt: string;
}
