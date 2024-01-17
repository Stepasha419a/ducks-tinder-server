import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from 'apps/user/src/application';

export const userFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new UserFacade(commandBus, queryBus);
