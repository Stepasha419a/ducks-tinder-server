import { Chat } from '../chat.interface';

export interface UnblockChat {
  unblockChat(): Promise<void>;
}

export async function UNBLOCK_CHAT(this: Chat) {
  this.blocked = false;
  this.blockedById = null;
}
