import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensCommand } from './generate-tokens.command';
import { TokenRepository } from 'apps/user/src/domain/token/repository';
import {
  AccessTokenValueObject,
  RefreshTokenValueObject,
} from 'apps/user/src/domain/token';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensCommandHandler
  implements ICommandHandler<GenerateTokensCommand>
{
  constructor(
    private readonly repository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: GenerateTokensCommand) {
    const { dto } = command;

    const accessTokenValue = this.jwtService.sign(dto, {
      expiresIn: '60m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const refreshTokenValue = this.jwtService.sign(dto, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const accessTokenValueObject = AccessTokenValueObject.create({
      value: accessTokenValue,
    });
    const refreshTokenValueObject = RefreshTokenValueObject.create({
      id: dto.userId,
      value: refreshTokenValue,
    });

    await this.repository.saveRefreshToken(refreshTokenValueObject);

    return {
      accessTokenValueObject,
      refreshTokenValueObject,
    };
  }
}
