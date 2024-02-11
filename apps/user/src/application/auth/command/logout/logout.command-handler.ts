import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UnauthorizedException } from '@nestjs/common';
import { TokenFacade } from '../../../token';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenFacade: TokenFacade) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    await this.tokenFacade.commands.removeToken(refreshTokenValue);
  }
}
