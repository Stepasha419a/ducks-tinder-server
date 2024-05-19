import { JwtService } from '@nestjs/jwt';
import { ValidateAccessTokenQuery } from './validate-access-token.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

@QueryHandler(ValidateAccessTokenQuery)
export class ValidateAccessTokenQueryHandler
  implements IQueryHandler<ValidateAccessTokenQuery>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: ValidateAccessTokenQuery) {
    const { accessTokenValue } = query;

    const userData = this.jwtService
      .verifyAsync(accessTokenValue, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })
      .catch(() => {
        return null;
      });

    return userData;
  }
}
