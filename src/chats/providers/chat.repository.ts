import { ChatMessage, PaginationChatAggregate } from 'chats/domain';
import { ChatAggregate } from 'chats/domain/chat.aggregate';
import { PaginationDto } from 'libs/shared/dto';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<PaginationChatAggregate[]>;
  abstract findMessages(
    chatId: string,
    dto: PaginationDto,
  ): Promise<ChatMessage[]>;
  abstract findMessagesCount(chatId: string): Promise<number>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
}
