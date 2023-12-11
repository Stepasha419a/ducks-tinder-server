export { GetUserQuery, GetUserQueryHandler } from './get-user';
export {
  GetUserByEmailQuery,
  GetUserByEmailQueryHandler,
} from './get-user-by-email';
export { GetSortedQuery, GetSortedQueryHandler } from './get-sorted';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQueryHandler } from './get-user';
import { GetUserByEmailQueryHandler } from './get-user-by-email';
import { GetSortedQueryHandler } from './get-sorted';

export const USER_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetUserQueryHandler,
  GetUserByEmailQueryHandler,
  GetSortedQueryHandler,
];
