import { Message, MessageAggregate } from 'apps/chat/src/domain';
import { ChatAggregate } from 'apps/chat/src/domain/chat.aggregate';
import { PaginationDto } from '@app/common/shared/dto';
import { ChatPaginationEntity, UserChatConnectionEntity } from '../entity';

export abstract class ChatRepository {
  abstract save(chat: ChatAggregate): Promise<ChatAggregate>;
  abstract saveMessage(message: MessageAggregate): Promise<MessageAggregate>;
  abstract saveUserChatConnection(
    chatVisit: UserChatConnectionEntity,
  ): Promise<UserChatConnectionEntity | null>;
  abstract findOne(id: string): Promise<ChatAggregate | null>;
  abstract findOneHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatAggregate | null>;
  abstract findOnePaginationHavingMember(
    id: string,
    userId: string,
  ): Promise<ChatPaginationEntity | null>;
  abstract findOneByUserIds(userIds: string[]): Promise<ChatAggregate | null>;
  abstract findMany(
    userId: string,
    dto: PaginationDto,
  ): Promise<ChatPaginationEntity[]>;
  abstract findMessage(messageId: string): Promise<MessageAggregate | null>;
  abstract findMessages(chatId: string, dto: PaginationDto): Promise<Message[]>;
  abstract findMessagesCount(chatId: string): Promise<number>;
  abstract findNewMessagesCount(userId: string): Promise<number>;
  abstract findUsersNewMessagesCount(
    chatId: string,
    userIds: string[],
  ): Promise<Record<string, number>>;
  abstract findChatUserIds(chatId: string): Promise<string[]>;
  abstract findUserChatConnection(
    userId: string,
    chatId: string,
  ): Promise<UserChatConnectionEntity | null>;
  abstract increaseChatVisits(
    chatId: string,
    exceptUserId: string,
    increaseValue: number,
  ): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
  abstract deleteMessage(messageId: string): Promise<boolean>;
}
