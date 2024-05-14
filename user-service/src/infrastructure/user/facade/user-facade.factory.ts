import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from 'user-service/src/application/user';

export const userFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new UserFacade(commandBus, queryBus);
