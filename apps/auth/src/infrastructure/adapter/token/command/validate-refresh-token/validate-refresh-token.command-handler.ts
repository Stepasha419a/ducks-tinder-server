import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateRefreshTokenCommand } from './validate-refresh-token.command';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from 'apps/auth/src/domain/repository';
import { UserTokenDto } from 'apps/auth/src/application/adapter/token';

@CommandHandler(ValidateRefreshTokenCommand)
export class ValidateRefreshTokenCommandHandler
  implements ICommandHandler<ValidateRefreshTokenCommand>
{
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ValidateRefreshTokenCommand) {
    const { value } = command;

    const existingRefreshToken = await this.repository.findOneByValue(value);
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const userData: UserTokenDto = await this.jwtService.verify(
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
