import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { randomUUID } from 'crypto';

export class RepliedMessageValueObject {
  @IsUUID()
  id: string = randomUUID();

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  userId: string;

  static create(repliedMessage: Partial<RepliedMessageValueObject>) {
    const _repliedMessage = new RepliedMessageValueObject();

    Object.assign(_repliedMessage, repliedMessage);

    const errors = validateSync(_repliedMessage, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Replied message is invalid');
    }

    return _repliedMessage;
  }
}
