import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidateRefreshTokenQuery } from './validate-refresh-token.query';
import { TokenRepository } from 'src/domain/token/repository';
import { UserTokenDto } from '../../command';

@QueryHandler(ValidateRefreshTokenQuery)
export class ValidateRefreshTokenQueryHandler
  implements IQueryHandler<ValidateRefreshTokenQuery>
{
  constructor(
    private readonly repository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: ValidateRefreshTokenQuery) {
    const { value } = query;

    const existingRefreshToken =
      await this.repository.findOneRefreshTokenByValue(value);
    if (!existingRefreshToken) {
      return null;
    }

    const userData: UserTokenDto = await this.jwtService
      .verifyAsync(existingRefreshToken.value, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        return null;
      });

    return userData;
  }
}
