import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from 'users/errors';
import { PaginationChat } from './pagination-chat.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { Message, MessageAggregate } from '../message';
import { Type } from 'class-transformer';

export class PaginationChatAggregate
  extends AggregateRoot
  implements PaginationChat
{
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => MessageAggregate)
  lastMessage?: Message;

  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsUUID()
  blockedById?: string;

  private constructor() {
    super();
  }

  static create(chat: Partial<PaginationChat>) {
    const _chat = new PaginationChatAggregate();

    Object.assign(_chat, chat);

    const errors = validateSync(_chat, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Pagination chat is invalid');
    }

    return _chat;
  }
}
