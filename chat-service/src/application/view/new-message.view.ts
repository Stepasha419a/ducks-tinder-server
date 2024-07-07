import { Message } from '../../domain/chat';

export interface NewMessageView {
  userNewMessagesCount: Record<string, number>;
  message: Message;
}
