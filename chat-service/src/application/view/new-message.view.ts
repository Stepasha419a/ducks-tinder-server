import { Message } from '../../domain';

export interface NewMessageView {
  userNewMessagesCount: Record<string, number>;
  message: Message;
}
