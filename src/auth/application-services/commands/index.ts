export { RegisterCommand, RegisterCommandHandler } from './register';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommandHandler } from './register';

export const AUTH_USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  RegisterCommandHandler,
];
