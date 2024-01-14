import { AccessTokenValueObject } from 'auth/domain';
import { WithoutPrivateFields as UserWithoutPrivateFields } from 'user/infrastructure/mapper';

export interface WithoutPrivateFields extends UserWithoutPrivateFields {
  accessToken: AccessTokenValueObject;
}
