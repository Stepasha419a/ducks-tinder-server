import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { AuthUserView } from '../../view';
import { TokenFacade } from '../../../token';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenFacade: TokenFacade,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserView> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const userData =
      await this.tokenFacade.queries.validateRefreshToken(refreshTokenValue);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne(userData.userId);
    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenFacade.commands.generateTokens({
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
