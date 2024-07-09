import { Injectable } from '@nestjs/common';
import { ServiceTokenView, UserTokenData } from './view';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
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

  private readonly minute = 1000 * 60;

  generateFileServiceToken(): ServiceTokenView {
    const accessToken = this.jwtService.sign(
      {},
      {
        expiresIn: '60m',
        secret: this.configService.get<string>('JWT_FILE_SERVICE_SECRET'),
      },
    );

    const expiresIn = new Date(Date.now() + this.minute * 59);

    return { accessToken: accessToken, expiresIn };
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
