import { CommandBus } from '@nestjs/cqrs';
import { ChatFacade } from 'chats/application-services';

export const chatFacadeFactory = (commandBus: CommandBus) =>
  new ChatFacade(commandBus);
