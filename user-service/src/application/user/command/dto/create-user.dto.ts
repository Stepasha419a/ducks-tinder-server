import { User } from 'user-service/src/domain/user';

export type CreateUserDto = Pick<
  User,
  'password' | 'name' | 'activationLink' | 'email'
>;
