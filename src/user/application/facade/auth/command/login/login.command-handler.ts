import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException } from '@nestjs/common';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'common/constants/error';
import { AuthUserAggregate } from 'user/domain/auth';
import { UserRepository } from 'user/domain/repository';
import { TokenAdapter } from 'user/application/adapter';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: LoginCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const user = await this.repository.findOneByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const isPassEquals = await user.comparePasswords(dto.password);
    if (!isPassEquals) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return AuthUserAggregate.create({
      user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}
