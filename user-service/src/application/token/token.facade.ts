import { Injectable } from '@nestjs/common';
import { UserTokenDto } from './command/dto';
import { GenerateTokensView } from './view';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateTokensCommand, RemoveTokenCommand } from './command';
import { ValidateAccessTokenQuery, ValidateRefreshTokenQuery } from './query';

@Injectable()
export class TokenFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    generateTokens: (dto: UserTokenDto) => this.generateTokens(dto),
    removeToken: (refreshTokenValue: string) =>
      this.removeToken(refreshTokenValue),
  };
  queries = {
    validateAccessToken: (accessTokenValue: string) =>
      this.validateAccessToken(accessTokenValue),
    validateRefreshToken: (refreshTokenValue: string) =>
      this.validateRefreshToken(refreshTokenValue),
  };

  private generateTokens(dto: UserTokenDto): Promise<GenerateTokensView> {
    return this.commandBus.execute<GenerateTokensCommand, GenerateTokensView>(
      new GenerateTokensCommand(dto),
    );
  }

  private removeToken(refreshTokenValue: string): Promise<void> {
    return this.commandBus.execute<RemoveTokenCommand>(
      new RemoveTokenCommand(refreshTokenValue),
    );
  }

  private validateRefreshToken(
    refreshTokenValue: string,
  ): Promise<UserTokenDto> {
    return this.queryBus.execute<
      ValidateRefreshTokenQuery,
      UserTokenDto | null
    >(new ValidateRefreshTokenQuery(refreshTokenValue));
  }

  private validateAccessToken(accessTokenValue: string): Promise<UserTokenDto> {
    return this.queryBus.execute<ValidateAccessTokenQuery, UserTokenDto | null>(
      new ValidateAccessTokenQuery(accessTokenValue),
    );
  }
}
