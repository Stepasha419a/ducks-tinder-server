import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { TokensService } from 'tokens/tokens.service';
import { UserService } from 'user/interface';
import { IS_PUBLIC_KEY } from 'common/constants';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokensService: TokensService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const client = context.switchToWs().getClient();
    const accessToken = client.handshake?.auth?.authorization;

    const userData = await this.tokensService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userData.userId);

    client.request.user = user;
    return true;
  }
}
