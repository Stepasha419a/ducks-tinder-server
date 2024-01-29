import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException, Inject } from '@nestjs/common';
import { INCORRECT_EMAIL_OR_PASSWORD } from '@app/common/constants/error';
import { AuthUserAggregate } from 'apps/auth/src/domain';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/constants';
import { firstValueFrom } from 'rxjs';
import { UserAggregate } from 'apps/user/src/domain';
import { compare } from 'bcryptjs';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: LoginCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const user = await firstValueFrom<UserAggregate | null>(
      this.userClient.send('get_user_by_email', dto.email),
    );

    if (!user) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const isPassEquals = await compare(dto.password, user.password);
    if (!isPassEquals) {
      throw new ForbiddenException(INCORRECT_EMAIL_OR_PASSWORD);
    }

    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: user.id,
        email: user.email,
      });

    return AuthUserAggregate.create({
      ...user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}
