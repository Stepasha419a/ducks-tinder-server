import { Message } from '../message.interface';

export interface ChatMessage extends Omit<Message, 'chatId'> {}
