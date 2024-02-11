export {
  ValidateRefreshTokenQuery,
  ValidateRefreshTokenQueryHandler,
} from './validate-refresh-token';
export {
  ValidateAccessTokenQuery,
  ValidateAccessTokenQueryHandler,
} from './validate-access-token';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenQueryHandler } from './validate-refresh-token';
import { ValidateAccessTokenQueryHandler } from './validate-access-token';

export const TOKEN_QUERY_HANDLERS: Type<ICommandHandler>[] = [
  ValidateRefreshTokenQueryHandler,
  ValidateAccessTokenQueryHandler,
];
