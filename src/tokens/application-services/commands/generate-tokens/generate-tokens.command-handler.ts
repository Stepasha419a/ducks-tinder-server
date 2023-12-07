import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensCommand } from './generate-tokens.command';
import { RefreshTokenRepository } from 'tokens/providers';
import { AccessTokenAggregate, RefreshTokenAggregate } from 'tokens/domain';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensCommandHandler
  implements ICommandHandler<GenerateTokensCommand>
{
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: GenerateTokensCommand) {
    const { dto } = command;

    const accessTokenValue = this.jwtService.sign(dto, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const refreshTokenValue = this.jwtService.sign(dto, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const accessTokenAggregate = AccessTokenAggregate.create({
      value: accessTokenValue,
    });
    const refreshTokenAggregate = await this.saveRefreshToken(
      dto.userId,
      refreshTokenValue,
    );

    return {
      accessTokenAggregate,
      refreshTokenAggregate,
    };
  }

  private async saveRefreshToken(userId: string, refreshTokenValue: string) {
    const savedRefreshTokenAggregate = await this.repository.save(
      RefreshTokenAggregate.create({
        id: userId,
        value: refreshTokenValue,
      }),
    );
    return savedRefreshTokenAggregate;
  }
}
