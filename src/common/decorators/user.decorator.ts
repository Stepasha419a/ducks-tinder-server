import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserOptions {
  isSocket?: boolean;
}

export const User = createParamDecorator(
  (options: UserOptions = null, ctx: ExecutionContext): string => {
    if (options?.isSocket) {
      const client = ctx.switchToWs().getClient();
      return client.request.userId;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.userId;
  },
);
