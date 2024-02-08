import * as bcrypt from 'bcryptjs';
import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { COMMON_ERROR } from '@app/common/shared/constant';
import { AuthUserAggregate } from 'apps/user/src/domain/auth/auth-user.aggregate';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';
import { randomUUID } from 'crypto';
import { SERVICES } from '@app/common/shared/constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserAggregate } from 'apps/user/src/domain/user';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    @Inject(SERVICES.USER) private readonly userClient: ClientProxy,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const candidate = await firstValueFrom<UserAggregate | null>(
      this.userClient.send('get_user_by_email', dto.email),
    );

    if (candidate) {
      throw new BadRequestException(COMMON_ERROR.USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(dto.password, 7);

    const activationLink = randomUUID();

    const user = await firstValueFrom<UserAggregate>(
      this.userClient.send('create_user', {
        ...dto,
        activationLink,
        password: hashPassword,
      }),
    );

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
