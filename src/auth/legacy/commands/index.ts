export { LogoutCommand } from './logout';
export { RefreshCommand } from './refresh';

import { LogoutCommandHandler } from './logout';
import { RefreshCommandHandler } from './refresh';

export const AuthCommandHandlers = [
  LogoutCommandHandler,
  RefreshCommandHandler,
];
