import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { USER_ALREADY_EXISTS } from '@app/common/constants/error';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AuthUserAggregate } from 'apps/auth/src/domain/auth-user.aggregate';
import { UserService } from 'apps/user/src/interface';
import { TokenAdapter } from 'apps/auth/src/application/adapter/token';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly userService: UserService,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(dto.password, 7);

    const activationLink = randomStringGenerator();

    const user = await this.userService.createUser({
      ...dto,
      activationLink,
      password: hashPassword,
    });

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
