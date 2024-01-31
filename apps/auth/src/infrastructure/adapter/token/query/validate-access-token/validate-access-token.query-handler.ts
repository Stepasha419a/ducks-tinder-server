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
    try {
      const { accessTokenValue } = query;

      const userData = this.jwtService.verify(accessTokenValue, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return userData;
    } catch (error) {
      return null;
    }
  }
}
