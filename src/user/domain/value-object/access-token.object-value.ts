import { IsJWT, validateSync } from 'class-validator';
import { DomainError } from 'libs/shared/errors';

export class AccessTokenObjectValue {
  @IsJWT()
  value: string;

  static create(accessToken: Partial<AccessTokenObjectValue>) {
    const _accessToken = new AccessTokenObjectValue();

    Object.assign(_accessToken, accessToken);

    const errors = validateSync(_accessToken, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Access token is invalid');
    }

    return _accessToken;
  }
}
