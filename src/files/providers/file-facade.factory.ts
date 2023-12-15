import { CommandBus } from '@nestjs/cqrs';
import { FileFacade } from 'files/application-services';

export const fileFacadeFactory = (commandBus: CommandBus) =>
  new FileFacade(commandBus);
