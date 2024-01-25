import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'apps/auth/src/application';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';

export const authFacadeFactory = (
  commandBus: CommandBus,
  tokenAdapter: TokenAdapter,
) => new AuthFacade(commandBus, tokenAdapter);
