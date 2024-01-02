import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException } from '@nestjs/common';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'common/constants/error';
import { AuthUserAggregate } from 'user/domain/auth';
import { UserRepository } from 'user/application/repository';
import { UserService } from 'user/interface';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly repository: UserRepository,
    private readonly userService: UserService,
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
