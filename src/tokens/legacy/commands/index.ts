export { ValidateRefreshTokenCommand } from './validate-refresh-token';
export { ValidateAccessTokenCommand } from './validate-access-token';

import { ValidateRefreshTokenCommandHandler } from './validate-refresh-token';
import { ValidateAccessTokenCommandHandler } from './validate-access-token';

export const TokenHandlers = [
  ValidateRefreshTokenCommandHandler,
  ValidateAccessTokenCommandHandler,
];
