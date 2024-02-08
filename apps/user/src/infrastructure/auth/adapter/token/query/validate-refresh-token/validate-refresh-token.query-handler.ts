import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from 'apps/user/src/domain/auth/repository';
import { UserTokenDto } from 'apps/auth/src/application/adapter/token';
import { ValidateRefreshTokenQuery } from './validate-refresh-token.query';

@QueryHandler(ValidateRefreshTokenQuery)
export class ValidateRefreshTokenQueryHandler
  implements IQueryHandler<ValidateRefreshTokenQuery>
{
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: ValidateRefreshTokenQuery) {
    const { value } = query;

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
