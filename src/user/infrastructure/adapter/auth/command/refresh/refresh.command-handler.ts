import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UserService } from 'user/interface';
import { RefreshCommand } from './refresh.command';
import { AuthUserAggregate } from 'user/domain/auth';
import { UserRepository } from 'user/application/repository';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userService: UserService,
    private readonly repository: UserRepository,
  ) {}

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

    const user = await this.repository.findOne(userData.userId);
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
