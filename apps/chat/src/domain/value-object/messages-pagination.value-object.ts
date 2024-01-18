import { IsArray, IsUUID, validateSync } from 'class-validator';
import { User, UserAggregate } from 'apps/user/src/domain';
import { Type } from 'class-transformer';
import { DomainError } from '@app/common/errors';
import { MessageAggregate } from '../message/message.aggregate';
import { Message } from '../message';

export class MessagesPaginationValueObject {
  @IsUUID()
  chatId: string;

  @IsArray()
  @IsArray()
  @Type(() => UserAggregate)
  users: User[];

  @IsArray()
  @IsArray()
  @Type(() => MessageAggregate)
  messages: Message[];

  static create(messagesPagination: Partial<MessagesPaginationValueObject>) {
    const _messagesPagination = new MessagesPaginationValueObject();

    Object.assign(_messagesPagination, messagesPagination);

    const errors = validateSync(_messagesPagination, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Messages pagination is invalid');
    }

    return _messagesPagination;
  }
}
