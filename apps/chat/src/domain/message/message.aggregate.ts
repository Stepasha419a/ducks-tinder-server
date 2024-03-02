import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { Message } from './message.interface';
import { Type } from 'class-transformer';
import { MessageServices } from './services';
import { randomUUID } from 'crypto';
import { RepliedMessageValueObject } from '../value-object';

export class MessageAggregate extends MessageServices implements Message {
  @IsUUID()
  id: string = randomUUID();

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar: string | null;

  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => RepliedMessageValueObject)
  replied?: RepliedMessageValueObject;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(message: Partial<Message>) {
    const _message = new MessageAggregate();

    Object.assign(_message, message);

    const errors = validateSync(_message, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Message is invalid');
    }

    return _message;
  }
}
