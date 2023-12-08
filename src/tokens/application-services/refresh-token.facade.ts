import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateTokensCommand, UserTokenDto } from './commands';
import { AccessTokenAggregate, RefreshTokenAggregate } from 'tokens/domain';
import { RemoveTokenCommand } from './commands/remove-token';

@Injectable()
export class RefreshTokenFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    generateTokens: (dto: UserTokenDto) => this.generateTokens(dto),
    removeToken: (refreshTokenValue: string) =>
      this.removeToken(refreshTokenValue),
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
}
