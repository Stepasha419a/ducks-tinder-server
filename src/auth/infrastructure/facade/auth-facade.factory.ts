import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'auth/application';

export const authFacadeFactory = (commandBus: CommandBus) =>
  new AuthFacade(commandBus);
