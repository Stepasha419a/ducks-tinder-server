export { GetPairsQuery } from './get-pairs';
export { GetSortedQuery } from './get-sorted';
export { GetUserQuery } from './get-user';

import { GetPairsQueryHandler } from './get-pairs';
import { GetSortedQueryHandler } from './get-sorted';
import { GetUserQueryHandler } from './get-user';

export const UserQueryHandlers = [
  GetPairsQueryHandler,
  GetSortedQueryHandler,
  GetUserQueryHandler,
];
