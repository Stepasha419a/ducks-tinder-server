import { Injectable } from '@nestjs/common';
import { ServiceTokenView, UserTokenData } from './view';
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

  generateFileServiceToken(): ServiceTokenView {
    const exp =
      this.dateService.getUnixNow() +
      this.configService.get<number>('JWT_FILE_SERVICE_EXPIRES_MS');

    const accessToken = this.jwtService.sign(
      { exp },
      {
        secret: this.configService.get<string>('JWT_FILE_SERVICE_SECRET'),
      },
    );

    return { token: accessToken, exp };
  }

  async validateFileServiceToken(accessToken: string): Promise<boolean> {
    await this.jwtService
      .verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_FILE_SERVICE_SECRET'),
      })
      .catch(() => {
        return false;
      });

    return true;
  }
}
