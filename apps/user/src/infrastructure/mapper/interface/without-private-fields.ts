import { User } from 'user/domain';
import { UserPictureInfo } from './user-picture-info';

export interface WithoutPrivateFields
  extends Omit<
    User,
    'activationLink' | 'password' | 'createdAt' | 'updatedAt' | 'pictures'
  > {
  pictures: UserPictureInfo[];
}
