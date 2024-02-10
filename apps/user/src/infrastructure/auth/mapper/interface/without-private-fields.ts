import { AccessTokenValueObject } from 'apps/user/src/domain/auth';
import { WithoutPrivateFields as UserWithoutPrivateFields } from 'apps/user/src/infrastructure/user/mapper';

export interface WithoutPrivateFields extends UserWithoutPrivateFields {
  accessToken: AccessTokenValueObject;
}
