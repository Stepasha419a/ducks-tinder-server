import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  JwtService as DomainJwtService,
  ServiceTokenView,
  UserTokenData,
  UserTokensView,
} from 'src/domain/service/jwt';

@Injectable()
export class JwtAdapter implements DomainJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateUserTokens(userId: string): UserTokensView {
    const data = { userId };
    const accessToken = this.jwtService.sign(data, {
      expiresIn: '60m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

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

  async validateRefreshToken(refreshToken: string): Promise<UserTokenData> {
    const userData = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        return null;
      });

    return userData;
  }

  private readonly minute = 1000 * 60;

  generateFileServiceToken(): ServiceTokenView {
    const accessToken = this.jwtService.sign(null, {
      expiresIn: '60m',
      secret: this.configService.get<string>('JWT_FILE_SERVICE_SECRET'),
    });

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
