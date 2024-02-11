import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { TokenAdapter } from 'apps/user/src/application/token';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { AuthUserView } from '../../view';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserView> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData =
      await this.tokenAdapter.validateRefreshToken(refreshTokenValue);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne(userData.userId);
    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return {
      ...user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    };
  }
}
