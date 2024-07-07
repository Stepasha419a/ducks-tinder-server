import { Message } from '../../domain/chat';

export class MessagesPaginationView {
  chatId: string;
  messages: Message[];
}
