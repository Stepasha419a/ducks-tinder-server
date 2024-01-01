import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { REFRESH_TOKEN_REGEX } from 'common/constants';
import { UserService } from 'user/interface';

@Injectable()
export class WsRefreshTokenGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const refreshToken = this.getRefreshTokenFromWs(client);

    const userData = await this.userService.validateRefreshToken(refreshToken);
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
