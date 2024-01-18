import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { IsBoolean, IsOptional, IsUUID, validateSync } from 'class-validator';
import { DomainError } from '@app/common/errors';
import { Chat } from './chat.interface';
import { ChatServices } from './services';

export class ChatAggregate extends ChatServices implements Chat {
  @IsUUID()
  id: string = randomStringGenerator();

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
