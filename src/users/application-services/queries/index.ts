export { GetUserQuery, GetUserQueryHandler } from './get-user';

import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetUserQueryHandler } from './get-user';

export const USER_QUERY_HANDLERS: Type<IQueryHandler>[] = [GetUserQueryHandler];
