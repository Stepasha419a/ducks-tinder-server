export { LoginCommand } from './login';
export { LogoutCommand } from './logout';
export { RefreshCommand } from './refresh';

import { LoginCommandHandler } from './login';
import { LogoutCommandHandler } from './logout';
import { RefreshCommandHandler } from './refresh';

export const AuthCommandHandlers = [
  LoginCommandHandler,
  LogoutCommandHandler,
  RefreshCommandHandler,
];
