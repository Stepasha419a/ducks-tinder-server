import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensCommand } from './generate-tokens.command';
import { UserRepository } from 'user/application/repository';
import { RefreshTokenValueObject, AccessTokenValueObject } from 'user/domain';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensCommandHandler
  implements ICommandHandler<GenerateTokensCommand>
{
  constructor(
    private readonly repository: UserRepository,
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
    const refreshTokenValueObject = await this.saveRefreshToken(
      dto.userId,
      refreshTokenValue,
    );

    return {
      accessTokenValueObject,
      refreshTokenValueObject,
    };
  }

  private async saveRefreshToken(userId: string, refreshTokenValue: string) {
    const savedRefreshTokenAggregate = await this.repository.saveRefreshToken(
      RefreshTokenValueObject.create({
        id: userId,
        value: refreshTokenValue,
      }),
    );
    return savedRefreshTokenAggregate;
  }
}
