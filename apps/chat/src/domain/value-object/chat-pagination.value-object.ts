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
import { Message, MessageAggregate } from '../message';

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
  @IsUUID()
  memberId: string;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => MessageAggregate)
  lastMessage?: Message;

  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsUUID()
  blockedById?: string;

  @IsString()
  @IsNotEmpty()
  createdAt;

  @IsString()
  @IsNotEmpty()
  updatedAt;

  @IsString()
  @IsNotEmpty()
  lastSeenAt;

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
