import { User } from 'apps/user/src/domain/user';

export type CreateUserDto = Pick<
  User,
  'password' | 'name' | 'activationLink' | 'email'
>;
