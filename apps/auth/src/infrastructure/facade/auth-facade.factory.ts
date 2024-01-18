import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'apps/auth/src/application';

export const authFacadeFactory = (commandBus: CommandBus) =>
  new AuthFacade(commandBus);
