import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { ERROR } from 'apps/user/src/infrastructure/auth/common/constant';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { AuthUserView } from '../../view';
import { TokenFacade } from '../../../token';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenFacade: TokenFacade,
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
