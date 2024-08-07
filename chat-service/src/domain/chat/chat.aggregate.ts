import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { DomainError } from '../common';
import { Chat } from './chat.interface';
import { ChatServices } from './service';
import { randomUUID } from 'crypto';

export class ChatAggregate extends ChatServices implements Chat {
  @IsUUID()
  id: string = randomUUID();

  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsUUID()
  blockedById?: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(chat: Partial<Chat>) {
    const _chat = new ChatAggregate();

    Object.assign(_chat, chat);

    const errors = validateSync(_chat, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Chat is invalid');
    }

    return _chat;
  }
}
