import { Injectable } from '@nestjs/common';
import { UserTokenData } from './view';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { DateService } from '../date';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
  ) {}

  async validateAccessToken(accessToken: string): Promise<UserTokenData> {
    const userData = await this.jwtService
      .verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })
      .catch(() => {
        return null;
      });

    return userData;
  }
}
