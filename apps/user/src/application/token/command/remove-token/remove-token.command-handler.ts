import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTokenCommand } from './remove-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { TokenRepository } from 'apps/user/src/domain/token/repository';

@CommandHandler(RemoveTokenCommand)
export class RemoveTokenCommandHandler
  implements ICommandHandler<RemoveTokenCommand>
{
  constructor(private readonly repository: TokenRepository) {}

  async execute(command: RemoveTokenCommand) {
    const { refreshTokenValue } = command;

    const existingRefreshToken =
      await this.repository.findOneRefreshTokenByValue(refreshTokenValue);
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.repository.deleteRefreshToken(existingRefreshToken.id);
  }
}
