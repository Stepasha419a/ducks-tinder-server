import { AggregateRoot } from '@nestjs/cqrs';
import { AccessToken } from './access-token.interface';
import { IsJWT, validateSync } from 'class-validator';
import { DomainError } from 'users/errors';

export class AccessTokenAggregate extends AggregateRoot implements AccessToken {
  @IsJWT()
  value: string;

  private constructor() {
    super();
  }

  static create(accessToken: Partial<AccessToken>) {
    const _accessToken = new AccessTokenAggregate();

    Object.assign(_accessToken, accessToken);

    const errors = validateSync(_accessToken, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Access token is invalid');
    }

    return _accessToken;
  }
}
