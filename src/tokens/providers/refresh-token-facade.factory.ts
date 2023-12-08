import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenFacade } from 'tokens/application-services';

export const refreshTokenFacadeFactory = (commandBus: CommandBus) =>
  new RefreshTokenFacade(commandBus);
