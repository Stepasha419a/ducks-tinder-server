import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UnauthorizedException } from '@nestjs/common';
import { TokenAdapter } from 'user/application/adapter';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenAdapter: TokenAdapter) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    await this.tokenAdapter.removeToken(refreshTokenValue);
  }
}
