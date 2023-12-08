import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ValidateAccessTokenCommand,
  ValidateRefreshTokenCommand,
} from './legacy/commands';
import { RefreshTokenFacade } from './application-services';
import { UserTokenDto } from './application-services/commands';

@Injectable()
export class TokensService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly facade: RefreshTokenFacade,
  ) {}

  public async generateTokens(dto: UserTokenDto) {
    return this.facade.commands.generateTokens(dto);
  }

  public async removeToken(refreshTokenValue: string) {
    return this.facade.commands.removeToken(refreshTokenValue);
  }

  public async validateRefreshToken(token: string) {
    return this.commandBus.execute(new ValidateRefreshTokenCommand(token));
  }

  public validateAccessToken(token: string) {
    return this.commandBus.execute(new ValidateAccessTokenCommand(token));
  }
}
