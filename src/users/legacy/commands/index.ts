export { ReturnUserCommand } from './return-user';
export { DeletePairCommand } from './delete-pair';
export { AcceptPairCommand } from './accept-pair';
export { RemoveAllPairsCommand } from './remove-all-pairs-dev';
export { CreatePairsCommand } from './create-pairs-dev';

import { ReturnUserCommandHandler } from './return-user';
import { DeletePairCommandHandler } from './delete-pair';
import { AcceptPairCommandHandler } from './accept-pair';
import { RemoveAllPairsCommandHandler } from './remove-all-pairs-dev';
import { CreatePairsCommandHandler } from './create-pairs-dev';

export const UserCommandHandlers = [
  ReturnUserCommandHandler,
  DeletePairCommandHandler,
  AcceptPairCommandHandler,
  RemoveAllPairsCommandHandler,
  CreatePairsCommandHandler,
];
