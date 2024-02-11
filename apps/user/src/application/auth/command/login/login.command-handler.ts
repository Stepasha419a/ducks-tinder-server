import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException } from '@nestjs/common';
import { TokenAdapter } from 'apps/user/src/application/token';
import { compare } from 'bcryptjs';
import { ERROR } from 'apps/user/src/infrastructure/auth/common/constant';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { AuthUserView } from '../../view';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenAdapter: TokenAdapter,
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
