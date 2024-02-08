import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';
import { SERVICES } from '@app/common/shared/constant';
import { ClientProxy } from '@nestjs/microservices';
import { UserAggregate } from 'apps/user/src/domain/user';
import { firstValueFrom } from 'rxjs';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserAggregate> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData =
      await this.tokenAdapter.validateRefreshToken(refreshTokenValue);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await firstValueFrom<UserAggregate>(
      this.userClient.send('get_user', userData.userId),
    );
    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return AuthUserAggregate.create({
      ...user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}
