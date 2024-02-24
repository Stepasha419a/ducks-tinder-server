import { Message } from '../../domain';

export interface DataMessageView extends Message {
  avatar: string | null;
  name: string;
}
