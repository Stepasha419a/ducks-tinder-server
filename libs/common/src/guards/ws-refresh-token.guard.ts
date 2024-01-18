import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';
import { REFRESH_TOKEN_REGEX } from '@app/common/constants';

@Injectable()
export class WsRefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenAdapter: TokenAdapter) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const refreshToken = this.getRefreshTokenFromWs(client);

    const userData = await this.tokenAdapter.validateRefreshToken(refreshToken);
    if (!userData) {
      throw new UnauthorizedException();
    }

    client.request.userId = userData.userId;
    return true;
  }

  private getRefreshTokenFromWs(client) {
    if (client?.handshake?.headers?.cookie) {
      // to get token from string 'refreshToken=...; accessToken=...'
      return client?.handshake?.headers?.cookie.match(REFRESH_TOKEN_REGEX)?.[1];
    } else {
      throw new UnauthorizedException();
    }
  }
}
