export { GetUserQuery, GetUserQueryHandler } from './get-user';
export {
  GetUserByEmailQuery,
  GetUserByEmailQueryHandler,
} from './get-user-by-email';
export { GetSortedQuery, GetSortedQueryHandler } from './get-sorted';
export { GetPairsQuery, GetPairsQueryHandler } from './get-pairs';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQueryHandler } from './get-user';
import { GetUserByEmailQueryHandler } from './get-user-by-email';
import { GetSortedQueryHandler } from './get-sorted';
import { GetPairsQueryHandler } from './get-pairs';

export const USER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetUserQueryHandler,
  GetUserByEmailQueryHandler,
  GetSortedQueryHandler,
  GetPairsQueryHandler,
];
