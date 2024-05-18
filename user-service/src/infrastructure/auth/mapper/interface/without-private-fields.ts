import { AccessTokenValueObject } from 'src/domain/token';
import { WithoutPrivateFields as UserWithoutPrivateFields } from 'src/infrastructure/user/mapper';

export interface WithoutPrivateFields extends UserWithoutPrivateFields {
  accessToken: AccessTokenValueObject;
}
