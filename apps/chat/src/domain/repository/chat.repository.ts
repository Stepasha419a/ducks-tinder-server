import { Message, MessageAggregate } from 'apps/chat/src/domain';
import { ChatAggregate } from 'apps/chat/src/domain/chat.aggregate';
import { PaginationDto } from '@app/common/dto';
import {
  ChatVisitValueObject,
  ChatPaginationValueObject,
} from '../value-object';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract saveMessage(message: MessageAggregate): Promise<MessageAggregate>;
  abstract saveChatVisit(
    chatVisit: ChatVisitValueObject,
  ): Promise<ChatVisitValueObject>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationValueObject[]>;
  abstract findMessage(messageId: string): Promise<MessageAggregate | null>;
  abstract findMessages(chatId: string, dto: PaginationDto): Promise<Message[]>;
  abstract findMessagesCount(chatId: string): Promise<number>;
  abstract findChatUserIds(chatId: string): Promise<string[]>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteMessage(messageId: string): Promise<boolean>;
}
