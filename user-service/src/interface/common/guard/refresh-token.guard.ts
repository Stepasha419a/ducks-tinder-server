import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from '../constant';
import { UserTokenDto } from './user-token.dto';
import { SERVICE } from 'src/infrastructure/rabbitmq/service/service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICE.USER) private readonly userClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const refreshTokenValue = this.extractTokenFromCookie(context);

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userTokenDto = await firstValueFrom<UserTokenDto | null>(
      this.userClient.send('validate_refresh_token', refreshTokenValue),
    );

    if (!userTokenDto) {
      throw new UnauthorizedException();
    }

    this.addUserId(userTokenDto.userId, context);

    return true;
  }

  private extractTokenFromCookie(
    context: ExecutionContext,
  ): string | undefined {
    let refreshToken: string;
    if (context.getType() === 'ws') {
      refreshToken = context
        .switchToWs()
        .getClient()
        ?.handshake?.headers?.cookie.match(this.REFRESH_TOKEN_REGEX)?.[1];
    } else if (context.getType() === 'http') {
      refreshToken = context.switchToHttp().getRequest().cookies?.refreshToken;
    }

    return refreshToken;
  }

  private addUserId(userId: string, context: ExecutionContext) {
    if (context.getType() === 'ws') {
      context.switchToWs().getClient().request.userId = userId;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().userId = userId;
    }
  }

  private readonly REFRESH_TOKEN_REGEX = /(?:refreshToken)=([\w\.\d-_]+)/;
}
