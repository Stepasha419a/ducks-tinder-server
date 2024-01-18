import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  GenerateTokensCommand,
  RemoveTokenCommand,
  ValidateRefreshTokenCommand,
  ValidateAccessTokenCommand,
} from './command';
import {
  GenerateTokensView,
  TokenAdapter,
  UserTokenDto,
} from 'apps/auth/src/application/adapter/token';

@Injectable()
export class TokenAdapterImplementation implements TokenAdapter {
  constructor(private readonly commandBus: CommandBus) {}

  generateTokens(dto: UserTokenDto): Promise<GenerateTokensView> {
    return this.commandBus.execute<GenerateTokensCommand, GenerateTokensView>(
      new GenerateTokensCommand(dto),
    );
  }

  removeToken(refreshTokenValue: string): Promise<void> {
    return this.commandBus.execute<RemoveTokenCommand>(
      new RemoveTokenCommand(refreshTokenValue),
    );
  }

  validateRefreshToken(refreshTokenValue: string): Promise<UserTokenDto> {
    return this.commandBus.execute<
      ValidateRefreshTokenCommand,
      UserTokenDto | null
    >(new ValidateRefreshTokenCommand(refreshTokenValue));
  }

  validateAccessToken(accessTokenValue: string): Promise<UserTokenDto> {
    return this.commandBus.execute<
      ValidateAccessTokenCommand,
      UserTokenDto | null
    >(new ValidateAccessTokenCommand(accessTokenValue));
  }
}
