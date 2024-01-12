import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTokenCommand } from './remove-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from 'auth/domain/repository';

@CommandHandler(RemoveTokenCommand)
export class RemoveTokenCommandHandler
  implements ICommandHandler<RemoveTokenCommand>
{
  constructor(private readonly repository: RefreshTokenRepository) {}

  async execute(command: RemoveTokenCommand) {
    const { refreshTokenValue } = command;

    const existingRefreshToken = await this.repository.findOneByValue(
      refreshTokenValue,
    );
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.repository.delete(existingRefreshToken.id);
  }
}
