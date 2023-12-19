import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChatFacade } from 'chats/application-services';

export const chatFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new ChatFacade(commandBus, queryBus);
