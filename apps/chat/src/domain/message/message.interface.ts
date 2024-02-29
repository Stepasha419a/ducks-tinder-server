import { RepliedMessageValueObject } from '../value-object';

export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  replied?: RepliedMessageValueObject;
  avatar: string | null;
  name: string;

  createdAt: string;
  updatedAt: string;
}
