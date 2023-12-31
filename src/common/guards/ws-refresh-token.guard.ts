import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { REFRESH_TOKEN_REGEX } from 'common/constants';
import { TokensService } from 'tokens/tokens.service';
import { UserService } from 'user/interface';

@Injectable()
export class WsRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly tokensService: TokensService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const refreshToken = this.getRefreshTokenFromWs(client);

    const userData = await this.tokensService.validateRefreshToken(
      refreshToken,
    );
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
