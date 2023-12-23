import { AggregateRoot } from '@nestjs/cqrs';
import { UserCheck } from './user-check.interface';
import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from 'users/errors';

export class UserCheckAggregate extends AggregateRoot implements UserCheck {
  @IsUUID()
  checkedId: string;

  @IsUUID()
  wasCheckedId: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  @IsString()
  @IsNotEmpty()
  updatedAt = new Date().toISOString();

  private constructor() {
    super();
  }

  static create(userCheck: Partial<UserCheck>) {
    const _userCheck = new UserCheckAggregate();

    Object.assign(_userCheck, userCheck);

    _userCheck.updatedAt = new Date().toISOString();
    const errors = validateSync(_userCheck, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User check is invalid');
    }

    return _userCheck;
  }
}
