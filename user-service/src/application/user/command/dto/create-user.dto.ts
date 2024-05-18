import { User } from 'src/domain/user';

export type CreateUserDto = Pick<
  User,
  'password' | 'name' | 'activationLink' | 'email'
>;
