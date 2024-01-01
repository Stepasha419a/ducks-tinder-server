import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTokenCommand } from './remove-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'user/application/repository';

@CommandHandler(RemoveTokenCommand)
export class RemoveTokenCommandHandler
  implements ICommandHandler<RemoveTokenCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: RemoveTokenCommand) {
    const { refreshTokenValue } = command;

    const existingRefreshToken = await this.repository.findRefreshTokenByValue(
      refreshTokenValue,
    );
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.repository.delete(existingRefreshToken.id);
  }
}
