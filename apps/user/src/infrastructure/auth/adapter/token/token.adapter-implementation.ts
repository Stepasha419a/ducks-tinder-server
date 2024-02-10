import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GenerateTokensCommand, RemoveTokenCommand } from './command';
import {
  GenerateTokensView,
  TokenAdapter,
  UserTokenDto,
} from 'apps/user/src/application/auth/adapter/token';
import { ValidateAccessTokenQuery, ValidateRefreshTokenQuery } from './query';

@Injectable()
export class TokenAdapterImplementation implements TokenAdapter {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
    return this.queryBus.execute<
      ValidateRefreshTokenQuery,
      UserTokenDto | null
    >(new ValidateRefreshTokenQuery(refreshTokenValue));
  }

  validateAccessToken(accessTokenValue: string): Promise<UserTokenDto> {
    return this.queryBus.execute<ValidateAccessTokenQuery, UserTokenDto | null>(
      new ValidateAccessTokenQuery(accessTokenValue),
    );
  }
}
