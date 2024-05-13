export interface Message {
  id: string;
  text: string;
  userId: string;
  chatId: string;
  replied?: RepliedMessage;
  avatar: string | null;
  name: string;

  createdAt: string;
  updatedAt: string;
}

export interface RepliedMessage {
  id: string;
  name: string;
  text: string;
  userId: string;
}
