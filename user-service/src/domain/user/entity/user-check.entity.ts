import { IsNotEmpty, IsString, IsUUID, validateSync } from 'class-validator';
import { DomainError } from 'src/domain/common';

export class UserCheckEntity {
  @IsUUID()
  checkedId: string;

  @IsUUID()
  wasCheckedId: string;

  @IsString()
  @IsNotEmpty()
  createdAt = new Date().toISOString();

  static create(userCheck: Partial<UserCheckEntity>) {
    const _userCheck = new UserCheckEntity();

    Object.assign(_userCheck, userCheck);

    const errors = validateSync(_userCheck, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'User check is invalid');
    }

    return _userCheck;
  }
}
