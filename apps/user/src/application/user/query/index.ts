export { GetUserQuery, GetUserQueryHandler } from './get-user';
export { GetManyUsersQuery, GetManyUsersQueryHandler } from './get-many-users';
export { GetMatchQuery, GetMatchQueryHandler } from './get-match';
export { GetPairsQuery, GetPairsQueryHandler } from './get-pairs';
export { GetPairsInfoQuery, GetPairsInfoQueryHandler } from './get-pairs-info';

import { GetUserQueryHandler } from './get-user';
import { GetManyUsersQueryHandler } from './get-many-users';
import { GetMatchQueryHandler } from './get-match';
import { GetPairsQueryHandler } from './get-pairs';
import { GetPairsInfoQueryHandler } from './get-pairs-info';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';

export const USER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetUserQueryHandler,
  GetManyUsersQueryHandler,
  GetMatchQueryHandler,
  GetPairsQueryHandler,
  GetPairsInfoQueryHandler,
];
