import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'user/domain/auth';
import { UserRepository } from 'user/application/repository';
import { TokenAdapter } from 'user/application/adapter';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly repository: UserRepository,
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

    const user = await this.repository.findOne(userData.userId);
    const { accessTokenAggregate, refreshTokenAggregate } =
      await this.tokenAdapter.generateTokens({
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
