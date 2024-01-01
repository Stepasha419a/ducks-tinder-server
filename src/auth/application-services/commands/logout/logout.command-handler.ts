import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensService } from 'tokens/tokens.service';
import { LogoutCommand } from './logout.command';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly refreshTokenService: TokensService) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenService.removeToken(refreshTokenValue);
  }
}
