import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from 'users/errors';
import { AggregateRoot } from '@nestjs/cqrs';
import { Message } from './message.interface';

export class MessageAggregate extends AggregateRoot implements Message {
  @IsUUID()
  id: string = randomStringGenerator();

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsOptional()
  @IsUUID()
  repliedId?: string;

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

    _message.updatedAt = _message?.id
      ? new Date().toISOString()
      : _message.updatedAt;
    const errors = validateSync(_message, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Message is invalid');
    }

    return _message;
  }
}
