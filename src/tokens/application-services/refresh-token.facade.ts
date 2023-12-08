import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateTokensCommand, UserTokenDto } from './commands';
import { AccessTokenAggregate, RefreshTokenAggregate } from 'tokens/domain';
import { RemoveTokenCommand } from './commands/remove-token';
import { ValidateRefreshTokenCommand } from './commands/validate-refresh-token';

@Injectable()
export class RefreshTokenFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    generateTokens: (dto: UserTokenDto) => this.generateTokens(dto),
    removeToken: (refreshTokenValue: string) =>
      this.removeToken(refreshTokenValue),
    validateRefreshToken: (refreshTokenValue: string) =>
      this.validateRefreshToken(refreshTokenValue),
  };
  queries = {};

  private generateTokens(dto: UserTokenDto) {
    return this.commandBus.execute<
      GenerateTokensCommand,
      {
        accessTokenAggregate: AccessTokenAggregate;
        refreshTokenAggregate: RefreshTokenAggregate;
      }
    >(new GenerateTokensCommand(dto));
  }

  private removeToken(refreshTokenValue: string) {
    return this.commandBus.execute<RemoveTokenCommand>(
      new RemoveTokenCommand(refreshTokenValue),
    );
  }

  private validateRefreshToken(refreshTokenValue: string) {
    return this.commandBus.execute<
      ValidateRefreshTokenCommand,
      UserTokenDto | null
    >(new ValidateRefreshTokenCommand(refreshTokenValue));
  }
}
