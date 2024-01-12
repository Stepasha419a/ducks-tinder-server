import { AuthUser } from './auth-user.interface';
import {
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuthUserServices } from './services';
import { User, UserAggregate } from 'user/domain';
import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from './value-object';
import { DomainError } from 'libs/shared/errors';

export class AuthUserAggregate extends AuthUserServices implements AuthUser {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserAggregate)
  user: User;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AccessTokenValueObject)
  accessToken: AccessTokenValueObject;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RefreshTokenValueObject)
  refreshToken: RefreshTokenValueObject;

  private constructor() {
    super();
  }

  static create(authUser: AuthUser) {
    const _authUser = new AuthUserAggregate();

    Object.assign(_authUser, authUser);

    const errors = validateSync(_authUser, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Auth user is invalid');
    }

    return _authUser;
  }
}
