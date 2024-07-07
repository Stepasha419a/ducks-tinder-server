import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  validateSync,
} from 'class-validator';
import { DomainError } from '../../common';

export class UserChatConnectionEntity {
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

  static create(userChatConnection: Partial<UserChatConnectionEntity>) {
    const _userChatConnection = new UserChatConnectionEntity();

    Object.assign(_userChatConnection, userChatConnection);

    const errors = validateSync(_userChatConnection, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User chat connection is invalid');
    }

    return _userChatConnection;
  }
}
