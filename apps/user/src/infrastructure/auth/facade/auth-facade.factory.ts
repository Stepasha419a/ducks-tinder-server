import { CommandBus } from '@nestjs/cqrs';
import { AuthFacade } from 'apps/user/src/application/auth';
import { TokenAdapter } from 'apps/user/src/application/auth/adapter/token';

export const authFacadeFactory = (
  commandBus: CommandBus,
  tokenAdapter: TokenAdapter,
) => new AuthFacade(commandBus, tokenAdapter);
