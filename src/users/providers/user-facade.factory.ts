import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from 'users/application-services';

export const userFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new UserFacade(commandBus, queryBus);
