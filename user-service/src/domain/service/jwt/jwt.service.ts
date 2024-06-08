import { Injectable } from '@nestjs/common';
import { ServiceTokenView, UserTokenData, UserTokensView } from './view';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AccessTokenValueObject, RefreshTokenEntity } from 'src/domain/token';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateUserTokens(userId: string): UserTokensView {
    const data = { userId };
    const accessTokenValue = this.jwtService.sign(data, {
      expiresIn: '60m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const refreshTokenValue = this.jwtService.sign(data, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const accessToken = AccessTokenValueObject.create({
      value: accessTokenValue,
    });
    const refreshToken = RefreshTokenEntity.create({
      id: userId,
      value: refreshTokenValue,
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
