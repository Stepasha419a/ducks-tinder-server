import { PaginationChatAggregate } from 'chats/domain';
import { ChatAggregate } from 'chats/domain/chat.aggregate';
import { PaginationDto } from 'libs/shared/dto';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<PaginationChatAggregate[]>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
}
