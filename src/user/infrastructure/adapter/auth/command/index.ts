export { RegisterCommand, RegisterCommandHandler } from './register';
export { LoginCommand, LoginCommandHandler } from './login';
export { LogoutCommand, LogoutCommandHandler } from './logout';
export { RefreshCommand, RefreshCommandHandler } from './refresh';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommandHandler } from './register';
import { LoginCommandHandler } from './login';
import { LogoutCommandHandler } from './logout';
import { RefreshCommandHandler } from './refresh';

export const AUTH_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  RegisterCommandHandler,
  LoginCommandHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
];
