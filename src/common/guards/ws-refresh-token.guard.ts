import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenAdapter } from 'auth/application/adapter/token';
import { REFRESH_TOKEN_REGEX } from 'common/constants';
import { UserService } from 'user/interface';

@Injectable()
export class WsRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly tokenAdapter: TokenAdapter,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const refreshToken = this.getRefreshTokenFromWs(client);

    const userData = await this.tokenAdapter.validateRefreshToken(refreshToken);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userData.userId);

    client.request.user = user;
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
