export { MixPicturesCommand } from './mix-pictures';
export { ReturnUserCommand } from './return-user';
export { DeletePairCommand } from './delete-pair';
export { CreateUserCommand } from './create-user';
export { AcceptPairCommand } from './accept-pair';
export { RemoveAllPairsCommand } from './remove-all-pairs-dev';
export { CreatePairsCommand } from './create-pairs-dev';

import { MixPicturesCommandHandler } from './mix-pictures';
import { ReturnUserCommandHandler } from './return-user';
import { DeletePairCommandHandler } from './delete-pair';
import { CreateUserCommandHandler } from './create-user';
import { AcceptPairCommandHandler } from './accept-pair';
import { RemoveAllPairsCommandHandler } from './remove-all-pairs-dev';
import { CreatePairsCommandHandler } from './create-pairs-dev';

export const UserCommandHandlers = [
  MixPicturesCommandHandler,
  ReturnUserCommandHandler,
  DeletePairCommandHandler,
  CreateUserCommandHandler,
  AcceptPairCommandHandler,
  RemoveAllPairsCommandHandler,
  CreatePairsCommandHandler,
];
