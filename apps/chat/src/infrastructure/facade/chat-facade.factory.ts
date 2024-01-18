import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChatFacade } from 'apps/chat/src/application';

export const chatFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new ChatFacade(commandBus, queryBus);
