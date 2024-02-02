import { IsBoolean, IsOptional, IsUUID, validateSync } from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { Chat } from './chat.interface';
import { ChatServices } from './services';
import { randomUUID } from 'crypto';

export class ChatAggregate extends ChatServices implements Chat {
  @IsUUID()
  id: string = randomUUID();

  @IsBoolean()
  blocked: boolean;

  @IsOptional()
  @IsUUID()
  blockedById?: string;

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
