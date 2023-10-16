import { User } from 'users/domain';

export type PatchUserDto = Partial<
  Pick<
    User,
    | 'age'
    | 'description'
    | 'distance'
    | 'email'
    | 'name'
    | 'nickname'
    | 'preferAgeFrom'
    | 'preferAgeTo'
    | 'preferSex'
    | 'sex'
    | 'usersOnlyInDistance'
  >
> &
  Pick<User, 'id' | 'email' | 'password' | 'name'>;
