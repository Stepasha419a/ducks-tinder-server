import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from '@app/common/shared/error';

export class UserCheckValueObject {
  @IsUUID()
  checkedId: string;

  @IsUUID()
  wasCheckedId: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  static create(userCheck: Partial<UserCheckValueObject>) {
    const _userCheck = new UserCheckValueObject();

    Object.assign(_userCheck, userCheck);

    const errors = validateSync(_userCheck, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User check is invalid');
    }

    return _userCheck;
  }
}
