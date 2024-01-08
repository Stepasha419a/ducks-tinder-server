import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenCommand } from './validate-refresh-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'user/domain/repository';
import { UserTokenDto } from 'user/application/adapter';

@CommandHandler(ValidateRefreshTokenCommand)
export class ValidateRefreshTokenCommandHandler
  implements ICommandHandler<ValidateRefreshTokenCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ValidateRefreshTokenCommand) {
    const { value } = command;

    const existingRefreshToken = await this.repository.findRefreshTokenByValue(
      value,
    );
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const userData: UserTokenDto = await this.jwtService.verifyAsync(
        existingRefreshToken.value,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      return userData;
    } catch (error) {
      return null;
    }
  }
}
