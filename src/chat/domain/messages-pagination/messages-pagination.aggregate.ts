import { AggregateRoot } from '@nestjs/cqrs';
import { IsArray, IsUUID, validateSync } from 'class-validator';
import { MessagesPagination } from './messages-pagination.interface';
import { ShortUser, UserAggregate } from 'user/domain';
import { Type } from 'class-transformer';
import { ChatMessage, ChatMessageDto } from '../message/chat-message';
import { DomainError } from 'libs/shared/errors';

export class MessagesPaginationAggregate
  extends AggregateRoot
  implements MessagesPagination
{
  @IsUUID()
  chatId: string;

  @IsArray()
  @IsArray()
  @Type(() => UserAggregate)
  users: ShortUser[];

  @IsArray()
  @IsArray()
  @Type(() => ChatMessageDto)
  messages: ChatMessage[];

  private constructor() {
    super();
  }

  static create(messagesPagination: Partial<MessagesPagination>) {
    const _messagesPagination = new MessagesPaginationAggregate();

    Object.assign(_messagesPagination, messagesPagination);

    const errors = validateSync(_messagesPagination, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Messages pagination is invalid');
    }

    return _messagesPagination;
  }
}
