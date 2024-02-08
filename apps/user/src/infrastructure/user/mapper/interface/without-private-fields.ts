import { User } from 'apps/user/src/domain/user';
import { UserPictureInfo } from './user-picture-info';

export interface WithoutPrivateFields
  extends Omit<
    User,
    'activationLink' | 'password' | 'createdAt' | 'updatedAt' | 'pictures'
  > {
  pictures: UserPictureInfo[];
}
