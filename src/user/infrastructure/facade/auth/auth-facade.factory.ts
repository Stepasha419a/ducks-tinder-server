import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'user/application/facade/auth';

export const authFacadeFactory = (commandBus: CommandBus) =>
  new AuthFacade(commandBus);
