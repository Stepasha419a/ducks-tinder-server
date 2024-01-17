import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from 'user/application';

export const userFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new UserFacade(commandBus, queryBus);
