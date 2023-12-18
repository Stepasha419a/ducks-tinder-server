import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from 'users/errors';
import { AggregateRoot } from '@nestjs/cqrs';
import { ChatVisit } from './chat-visit.interface';

export class ChatVisitAggregate extends AggregateRoot implements ChatVisit {
  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  lastSeen: string;

  private constructor() {
    super();
  }

  static create(chatVisit: Partial<ChatVisit>) {
    const _chatVisit = new ChatVisitAggregate();

    Object.assign(_chatVisit, chatVisit);

    const errors = validateSync(_chatVisit, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Chat-visit is invalid');
    }

    return _chatVisit;
  }
}
