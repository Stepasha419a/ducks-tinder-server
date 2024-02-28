import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { Type } from 'class-transformer';
import { ChatVisitValueObject } from './chat-visit.value-object';
import { UserMessageValueObject } from './user-message.value-object';

export class ChatPaginationValueObject {
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
  @Type(() => UserMessageValueObject)
  lastMessage?: UserMessageValueObject;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => ChatVisitValueObject)
  chatVisit?: ChatVisitValueObject;

  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsUUID()
  blockedById?: string;

  static create(chat: Partial<ChatPaginationValueObject>) {
    const _chat = new ChatPaginationValueObject();

    Object.assign(_chat, chat);

    const errors = validateSync(_chat, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Pagination chat is invalid');
    }

    return _chat;
  }
}
