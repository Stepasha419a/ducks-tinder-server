import { AggregateRoot } from '@nestjs/cqrs';
import { AuthUser } from './auth-user.interface';
import {
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User, UserAggregate } from 'users/domain';
import { DomainError } from 'users/errors';
import { AccessTokenAggregate, RefreshTokenAggregate } from 'tokens/domain';

export class AuthUserAggregate extends AggregateRoot implements AuthUser {
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserAggregate)
  user: User;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AccessTokenAggregate)
  accessToken: AccessTokenAggregate;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RefreshTokenAggregate)
  refreshToken: RefreshTokenAggregate;

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

  withoutPrivateFields(): Partial<AuthUser> {
    return { user: this.user, accessToken: this.accessToken };
  }
}
