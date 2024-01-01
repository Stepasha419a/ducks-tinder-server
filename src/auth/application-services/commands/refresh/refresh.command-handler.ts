import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UserService } from 'user/interface';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'auth/domain';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(private readonly userService: UserService) {}

  async execute(command: RefreshCommand): Promise<AuthUserAggregate> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData = await this.userService.validateRefreshToken(
      refreshTokenValue,
    );
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userData.userId);
    const { accessTokenAggregate, refreshTokenAggregate } =
      await this.userService.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return AuthUserAggregate.create({
      user,
      accessToken: accessTokenAggregate,
      refreshToken: refreshTokenAggregate,
    });
  }
}
