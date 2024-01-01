import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { TokensService } from 'tokens/tokens.service';
import { UserService } from 'user/interface';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'auth/domain';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: TokensService,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserAggregate> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData = await this.refreshTokenService.validateRefreshToken(
      refreshTokenValue,
    );
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userData.userId);
    const { accessTokenAggregate, refreshTokenAggregate } =
      await this.refreshTokenService.generateTokens({
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
