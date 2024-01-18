import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@app/common/constants';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenAdapter: TokenAdapter,
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

    const userData = await this.tokenAdapter.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException();
    }

    client.request.userId = userData.userId;
    return true;
  }
}
