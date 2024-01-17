import { AccessTokenValueObject } from 'auth/domain';
import { WithoutPrivateFields as UserWithoutPrivateFields } from 'apps/user/src/infrastructure/mapper';

export interface WithoutPrivateFields extends UserWithoutPrivateFields {
  accessToken: AccessTokenValueObject;
}
