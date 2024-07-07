import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constant';
import { JwtService } from 'src/domain/service/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
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

    const userTokenDto =
      await this.jwtService.validateAccessToken(accessTokenValue);

    if (!userTokenDto) {
      throw new UnauthorizedException();
    }

    this.addUserId(userTokenDto.userId, context);

    return true;
  }

  private extractTokenFromHeader(
    context: ExecutionContext,
  ): string | undefined {
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
    return type === 'Bearer' ? token : undefined;
  }

  private addUserId(userId: string, context: ExecutionContext) {
    if (context.getType() === 'ws') {
      context.switchToWs().getClient().request.userId = userId;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().userId = userId;
    }
  }
}
