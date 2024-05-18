import { IsJWT, validateSync } from 'class-validator';
import { DomainError } from 'src/domain/common';

export class AccessTokenValueObject {
  @IsJWT()
  value: string;

  static create(accessToken: Partial<AccessTokenValueObject>) {
    const _accessToken = new AccessTokenValueObject();

    Object.assign(_accessToken, accessToken);

    const errors = validateSync(_accessToken, { whitelist: true });
    if (errors.length) {
      throw new DomainError(errors, 'Access token is invalid');
    }

    return _accessToken;
  }
}
