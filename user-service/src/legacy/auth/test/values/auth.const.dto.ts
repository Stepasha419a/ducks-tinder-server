import { UserStub } from 'src/test/stub';

export const CREATE_USER_DTO = {
  email: UserStub().email,
  password: '123123123',
  name: UserStub().name,
};

export const LOGIN_USER_DTO = {
  email: UserStub().email,
  password: '123123123',
};
