import { CreateUserDto } from 'users/legacy/dto';
import { userDtoStub } from 'users/test/stubs';
import { LoginUserDto } from 'auth/legacy/dto';

export const CREATE_USER_DTO: CreateUserDto = {
  email: userDtoStub().email,
  password: '123123123',
  name: userDtoStub().name,
};

export const LOGIN_USER_DTO: LoginUserDto = {
  email: userDtoStub().email,
  password: '123123123',
};
