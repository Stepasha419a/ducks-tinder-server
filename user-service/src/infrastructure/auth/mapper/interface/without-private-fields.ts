import { AccessTokenValueObject } from 'user-service/src/domain/token';
import { WithoutPrivateFields as UserWithoutPrivateFields } from 'user-service/src/infrastructure/user/mapper';

export interface WithoutPrivateFields extends UserWithoutPrivateFields {
  accessToken: AccessTokenValueObject;
}
