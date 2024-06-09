import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { ERROR } from 'src/infrastructure/auth/common/constant';
import { UserRepository } from 'src/domain/user/repository';
import { AuthUserView } from '../../view';
import { JwtService } from 'src/domain/service/jwt';
import { TokenRepository } from 'src/domain/token/repository';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<AuthUserView> {
    const { dto } = command;

    const user = await this.userRepository.findOneByEmail(dto.email);

    if (!user) {
      throw new ForbiddenException(ERROR.INCORRECT_EMAIL_OR_PASSWORD);
    }

    const isPassEquals = await compare(dto.password, user.password);
    if (!isPassEquals) {
      throw new ForbiddenException(ERROR.INCORRECT_EMAIL_OR_PASSWORD);
    }

    const { accessToken, refreshToken } =
      await this.jwtService.generateUserTokens(user.id);

    await this.tokenRepository.saveRefreshToken(refreshToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}
