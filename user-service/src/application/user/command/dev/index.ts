export {
  CreatePairsCommand,
  CreatePairsCommandHandler,
} from './create-pairs-dev';
export {
  RemoveAllPairsCommand,
  RemoveAllPairsCommandHandler,
} from './remove-all-pairs-dev';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { CreatePairsCommandHandler } from './create-pairs-dev';
import { RemoveAllPairsCommandHandler } from './remove-all-pairs-dev';

export const USER_DEV_HANDLERS: Type<ICommandHandler>[] = [
  CreatePairsCommandHandler,
  RemoveAllPairsCommandHandler,
];
