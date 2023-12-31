import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from 'libs/shared/errors';
import { PaginationChat } from './pagination-chat.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { ChatMessage, ChatMessageDto } from '../message';
import { Type } from 'class-transformer';
import { ChatVisit, ChatVisitAggregate } from '../chat-visit';

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
  @Type(() => ChatMessageDto)
  lastMessage?: ChatMessage;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => ChatVisitAggregate)
  chatVisit?: ChatVisit;

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
