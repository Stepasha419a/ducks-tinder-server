export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  repliedId?: string;

  createdAt: string;
  updatedAt: string;
}
