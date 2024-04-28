import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from '@app/common/shared/error';
import { AggregateRoot } from '@nestjs/cqrs';

export class UserCheckAggregate extends AggregateRoot {
  @IsUUID()
  checkedId: string;

  @IsUUID()
  wasCheckedId: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  static create(userCheck: Partial<UserCheckAggregate>) {
    const _userCheck = new UserCheckAggregate();

    Object.assign(_userCheck, userCheck);

    const errors = validateSync(_userCheck, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User check is invalid');
    }

    return _userCheck;
  }
}
