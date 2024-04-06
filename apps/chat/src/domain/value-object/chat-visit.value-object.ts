import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '@app/common/shared/error';

export class ChatVisitValueObject {
  @IsUUID()
  userId: string;

  @IsUUID()
  chatId: string;

  @IsInt()
  @Min(0)
  newMessagesCount: number = 0;

  @IsString()
  @IsNotEmpty()
  createdAt: string = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  lastSeenAt: string = new Date().toISOString();

  static create(chatVisit: Partial<ChatVisitValueObject>) {
    const _chatVisit = new ChatVisitValueObject();

    Object.assign(_chatVisit, chatVisit);

    const errors = validateSync(_chatVisit, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Chat visit is invalid');
    }

    return _chatVisit;
  }
}
