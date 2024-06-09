import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UnauthorizedException } from '@nestjs/common';
import { TokenRepository } from 'src/domain/token/repository';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const existingRefreshToken =
      await this.tokenRepository.findOneRefreshTokenByValue(refreshTokenValue);
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.tokenRepository.deleteRefreshToken(existingRefreshToken.id);
  }
}
