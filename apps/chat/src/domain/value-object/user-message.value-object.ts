import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { randomUUID } from 'crypto';
import { Message, RepliedMessage, RepliedMessageDto } from '../message';
import { Type } from 'class-transformer';

export class UserMessageValueObject implements Message {
  @IsUUID()
  id: string = randomUUID();

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => RepliedMessageDto)
  replied?: RepliedMessage;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  static create(chatVisit: Partial<UserMessageValueObject>) {
    const _chatVisit = new UserMessageValueObject();

    Object.assign(_chatVisit, chatVisit);

    const errors = validateSync(_chatVisit, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User message is invalid');
    }

    return _chatVisit;
  }
}
