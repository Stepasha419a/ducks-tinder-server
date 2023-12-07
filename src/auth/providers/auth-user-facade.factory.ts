import { CommandBus } from '@nestjs/cqrs';
import { AuthUserFacade } from 'auth/application-services';

export const authUserFacadeFactory = (commandBus: CommandBus) =>
  new AuthUserFacade(commandBus);
