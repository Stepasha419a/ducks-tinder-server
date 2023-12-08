import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { UsersService } from 'users/users.service';
import { TokensService } from 'tokens/tokens.service';
import { ForbiddenException } from '@nestjs/common';
import { INCORRECT_EMAIL_OR_PASSWORD } from 'common/constants/error';
import { AuthUserAggregate } from 'auth/domain';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UsersService,
    private readonly refreshTokenService: TokensService,
  ) {}

  async execute(command: LoginCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const isPassEquals = await user.comparePasswords(dto.password);
    if (!isPassEquals) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const { accessTokenAggregate, refreshTokenAggregate } =
      await this.refreshTokenService.generateTokens({
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
