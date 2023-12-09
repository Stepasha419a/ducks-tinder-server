export {
  GenerateTokensCommand,
  GenerateTokensCommandHandler,
} from './generate-tokens';
export {
  ValidateRefreshTokenCommand,
  ValidateRefreshTokenCommandHandler,
} from './validate-refresh-token';
export {
  ValidateAccessTokenCommand,
  ValidateAccessTokenCommandHandler,
} from './validate-access-token';
export { RemoveTokenCommand, RemoveTokenCommandHandler } from './remove-token';

export * from './dto';

import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommandHandler } from './generate-tokens';
import { ValidateRefreshTokenCommandHandler } from './validate-refresh-token';
import { ValidateAccessTokenCommandHandler } from './validate-access-token';
import { RemoveTokenCommandHandler } from './remove-token';

export const TOKEN_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  GenerateTokensCommandHandler,
  ValidateRefreshTokenCommandHandler,
  ValidateAccessTokenCommandHandler,
  RemoveTokenCommandHandler,
];
