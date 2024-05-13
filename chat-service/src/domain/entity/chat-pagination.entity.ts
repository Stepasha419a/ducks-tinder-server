import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { Type } from 'class-transformer';
import { Message, MessageAggregate } from '../message';

export class ChatPaginationEntity {
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

  @IsInt()
  @Min(0)
  newMessagesCount: number = 0;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @IsString()
  @IsNotEmpty()
  lastSeenAt: string;

  static create(chat: Partial<ChatPaginationEntity>) {
    const _chat = new ChatPaginationEntity();

    Object.assign(_chat, chat);

    const errors = validateSync(_chat, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Pagination chat is invalid');
    }

    return _chat;
  }
}
