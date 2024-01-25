import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { IS_PUBLIC_KEY, SERVICES } from '@app/common/constants';
import { Request } from 'express';
import { UserTokenDto } from 'apps/auth/src/application/adapter/token';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, tap } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const accessTokenValue = this.extractTokenFromHeader(req);

    if (!accessTokenValue) {
      throw new UnauthorizedException();
    }

    await this.authClient.send('validate_access_token', accessTokenValue).pipe(
      tap((userData: UserTokenDto) => {
        this.attachUserId(userData.userId, context);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private attachUserId(userId: string, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.userId = userId;
  }
}
