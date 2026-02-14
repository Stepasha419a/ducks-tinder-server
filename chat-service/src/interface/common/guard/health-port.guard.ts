import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class HealthPortGuard implements CanActivate {
  healthPort: number;

  constructor(private readonly configService: ConfigService) {
    this.healthPort = Number(this.configService.get('HEALTH_PORT'));
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const serverPort = request.socket.localPort;

    if (serverPort !== this.healthPort) {
      throw new ForbiddenException();
    }

    return true;
  }
}
