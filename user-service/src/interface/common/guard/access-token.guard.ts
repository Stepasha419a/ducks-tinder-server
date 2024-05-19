import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constant';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
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

    const userData = await this.jwtService
      .verifyAsync(accessTokenValue, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })
      .catch(() => {
        return false;
      });

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
