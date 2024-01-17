import { User } from 'apps/user/src/domain';

export type CreateUserDto = Pick<
  User,
  'password' | 'name' | 'activationLink' | 'email'
>;
