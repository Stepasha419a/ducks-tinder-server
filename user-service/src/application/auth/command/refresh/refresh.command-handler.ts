import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { UserRepository } from 'src/domain/user/repository';
import { AuthUserView } from '../../view';
import { TokenRepository } from 'src/domain/token/repository';
import { JwtService } from 'src/domain/service/jwt';

@CommandHandler(RefreshCommand)
export class RefreshCommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthUserView> {
    const { refreshTokenValue } = command;

    if (!refreshTokenValue) {
      throw new UnauthorizedException();
    }

    const existingRefreshToken =
      await this.tokenRepository.findOneRefreshTokenByValue(refreshTokenValue);
    if (!existingRefreshToken) {
      throw new UnauthorizedException();
    }

    const userData =
      await this.jwtService.validateRefreshToken(refreshTokenValue);
    if (!userData) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne(userData.userId);
    const { accessToken, refreshToken } =
      await this.jwtService.generateUserTokens(user.id);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}
