import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { ForbiddenException, Inject } from '@nestjs/common';
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import { TokenAdapter } from 'apps/user/src/application/auth/adapter/token';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/common/shared/constant';
import { firstValueFrom } from 'rxjs';
import { UserAggregate } from 'apps/user/src/domain/user';
import { compare } from 'bcryptjs';
import { ERROR } from 'apps/user/src/infrastructure/auth/common/constant';

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

    return AuthUserAggregate.create({
      ...user,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}
