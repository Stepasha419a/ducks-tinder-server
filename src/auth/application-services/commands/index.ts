export { RegisterCommand, RegisterCommandHandler } from './register';
export { LoginCommand, LoginCommandHandler } from './login';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommandHandler } from './register';
import { LoginCommandHandler } from './login';

export const AUTH_USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  RegisterCommandHandler,
  LoginCommandHandler,
];
