import { ChatMessage } from '../chat-message';
import { Message } from '../message.interface';

export interface GetChatMessage {
  getChatMessage(): Promise<ChatMessage>;
}

export async function GET_CHAT_MESSAGE(this: Message): Promise<ChatMessage> {
  return {
    id: this.id,
    userId: this.userId,
    text: this.text,
    replied: this.replied,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
  };
}
