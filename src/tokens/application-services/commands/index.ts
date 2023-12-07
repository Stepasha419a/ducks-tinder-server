export {
  GenerateTokensCommand,
  GenerateTokensCommandHandler,
} from './generate-tokens';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommandHandler } from './generate-tokens';

export const TOKEN_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  GenerateTokensCommandHandler,
];
