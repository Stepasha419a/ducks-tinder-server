import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constant';
import { JwtService } from 'src/domain/service/jwt';
import { RABBIT_CONTEXT_TYPE_KEY } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const contextType = context.getType<
      'http' | typeof RABBIT_CONTEXT_TYPE_KEY
    >();

    if (contextType === RABBIT_CONTEXT_TYPE_KEY) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const accessTokenValue = this.extractTokenFromHeader(context);

    if (!accessTokenValue) {
      throw new UnauthorizedException();
    }

    const userData =
      await this.jwtService.validateAccessToken(accessTokenValue);

    if (!userData) {
      throw new UnauthorizedException();
    }

    this.addUserId(userData.userId, context);

    return true;
  }

  private extractTokenFromHeader(context: ExecutionContext): string | null {
    let authorization: string;
    if (context.getType() === 'ws') {
      authorization = context.switchToWs().getClient().handshake
        ?.auth?.authorization;
    } else if (context.getType() === 'http') {
      authorization = context.switchToHttp().getRequest()
        .headers?.authorization;
    }

    if (!authorization) {
      return null;
    }

    const [type, token] = authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  private addUserId(userId: string, context: ExecutionContext) {
    if (context.getType() === 'ws') {
      context.switchToWs().getClient().request.userId = userId;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().userId = userId;
    }
  }
}
