import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenFacade } from 'apps/user/src/application/token';

export const tokenFacadeFactory = (
  commandBus: CommandBus,
  queryBus: QueryBus,
) => new TokenFacade(commandBus, queryBus);
