import { userDtoStub } from 'user/legacy/test/stubs';

export const CREATE_USER_DTO = {
  email: userDtoStub().email,
  password: '123123123',
  name: userDtoStub().name,
};

export const LOGIN_USER_DTO = {
  email: userDtoStub().email,
  password: '123123123',
};
