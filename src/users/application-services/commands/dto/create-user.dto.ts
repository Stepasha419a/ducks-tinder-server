import { User } from 'users/domain';

export type CreateUserDto = Pick<
  User,
  'password' | 'name' | 'activationLink' | 'email'
>;
