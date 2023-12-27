import { ChatSocketReturn } from './chats.interface';

interface ChatUser {
  id: string;
}

interface Chat {
  id: string;
  users: ChatUser[];
}

export class ChatsMapper {
  static mapChat(chat: Chat): ChatSocketReturn {
    return {
      chatId: chat.id,
      users: this.mapUserIds(chat.users),
    };
  }

  static mapWithoutUsers(data: ChatSocketReturn) {
    return { ...data, users: undefined };
  }

  private static mapUserIds(users: ChatUser[]) {
    return users.map((user) => user.id);
  }
}
