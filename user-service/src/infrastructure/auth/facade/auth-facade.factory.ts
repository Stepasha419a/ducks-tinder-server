import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'src/application/auth';

export const authFacadeFactory = (commandBus: CommandBus) =>
  new AuthFacade(commandBus);
