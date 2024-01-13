import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'auth/domain';
import { UserService } from 'user/interface';
import { TokenAdapter } from 'auth/application/adapter/token';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userService: UserService,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserAggregate> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData = await this.tokenAdapter.validateRefreshToken(
      refreshTokenValue,
    );
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userData.userId);
    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return AuthUserAggregate.create({
      user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}