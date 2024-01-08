import {
  ChatMessage,
  ChatVisitAggregate,
  MessageAggregate,
  PaginationChatAggregate,
} from 'chat/domain';
import { ChatAggregate } from 'chat/domain/chat.aggregate';
import { PaginationDto } from 'libs/shared/dto';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract saveMessage(message: MessageAggregate): Promise<MessageAggregate>;
  abstract saveChatVisit(
    chatVisit: ChatVisitAggregate,
  ): Promise<ChatVisitAggregate>;
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
  abstract findMessage(messageId: string): Promise<MessageAggregate | null>;
  abstract findMessages(
    chatId: string,
    dto: PaginationDto,
  ): Promise<ChatMessage[]>;
  abstract findMessagesCount(chatId: string): Promise<number>;
  abstract findChatUserIds(chatId: string): Promise<string[]>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteMessage(messageId: string): Promise<boolean>;
}
