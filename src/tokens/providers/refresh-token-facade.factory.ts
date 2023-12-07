import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RefreshTokenFacade } from 'tokens/application-services';

export const refreshTokenFacadeFactory = (
  commandBus: CommandBus,
  queryBus: QueryBus,
) => new RefreshTokenFacade(commandBus, queryBus);
