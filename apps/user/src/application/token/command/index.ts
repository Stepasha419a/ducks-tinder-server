export {
  GenerateTokensCommand,
  GenerateTokensCommandHandler,
} from './generate-tokens';
export { RemoveTokenCommand, RemoveTokenCommandHandler } from './remove-token';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommandHandler } from './generate-tokens';
import { RemoveTokenCommandHandler } from './remove-token';

export const TOKEN_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  GenerateTokensCommandHandler,
  RemoveTokenCommandHandler,
];
