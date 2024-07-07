import { Chat } from '../chat.interface';

export interface BlockChat {
  blockChat(byUserId: string): Promise<void>;
}

export async function BLOCK_CHAT(this: Chat, byUserId: string) {
  this.blocked = true;
  this.blockedById = byUserId;
}
