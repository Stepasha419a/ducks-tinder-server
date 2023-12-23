export { DeletePairCommand } from './delete-pair';
export { RemoveAllPairsCommand } from './remove-all-pairs-dev';
export { CreatePairsCommand } from './create-pairs-dev';

import { DeletePairCommandHandler } from './delete-pair';
import { RemoveAllPairsCommandHandler } from './remove-all-pairs-dev';
import { CreatePairsCommandHandler } from './create-pairs-dev';

export const UserCommandHandlers = [
  DeletePairCommandHandler,
  RemoveAllPairsCommandHandler,
  CreatePairsCommandHandler,
];
