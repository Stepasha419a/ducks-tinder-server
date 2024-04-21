import { Message, MessageAggregate } from 'apps/chat/src/domain';
import { ChatAggregate } from 'apps/chat/src/domain/chat.aggregate';
import { PaginationDto } from '@app/common/shared/dto';
import {
  ChatPaginationValueObject,
  ChatVisitValueObject,
} from '../value-object';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract saveMessage(message: MessageAggregate): Promise<MessageAggregate>;
  abstract saveChatVisit(
    chatVisit: ChatVisitValueObject,
  ): Promise<ChatVisitValueObject | null>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract findOnePaginationHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatPaginationValueObject | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationValueObject[]>;
  abstract findMessage(messageId: string): Promise<MessageAggregate | null>;
  abstract findMessages(chatId: string, dto: PaginationDto): Promise<Message[]>;
  abstract findMessagesCount(chatId: string): Promise<number>;
  abstract findNewMessagesCount(userId: string): Promise<number>;
  abstract findUsersNewMessagesCount(
    chatId: string,
    userIds: string[],
  ): Promise<Record<string, number>>;
  abstract findChatUserIds(chatId: string): Promise<string[]>;
  abstract findChatVisit(
    userId: string,
    chatId: string,
  ): Promise<ChatVisitValueObject | null>;
  abstract connectUserToChat(
    chatId: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract increaseChatVisits(
    chatId: string,
    exceptUserId: string,
    increaseValue: number,
  ): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteMessage(messageId: string): Promise<boolean>;
}
