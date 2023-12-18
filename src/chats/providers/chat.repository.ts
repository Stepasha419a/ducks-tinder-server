import { ChatAggregate } from 'chats/domain/chat.aggregate';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
}
