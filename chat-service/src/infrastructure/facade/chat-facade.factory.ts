import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChatFacade } from 'chat-service/src/application';

export const chatFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new ChatFacade(commandBus, queryBus);
