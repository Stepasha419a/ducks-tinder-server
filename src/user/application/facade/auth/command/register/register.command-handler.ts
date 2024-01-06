import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { USER_ALREADY_EXISTS } from 'common/constants/error';
import { AuthUserAggregate } from 'user/domain/auth/auth-user.aggregate';
import { UserRepository } from 'user/application/repository';
import { UserAggregate } from 'user/domain';
import { TokenAdapter } from 'user/application/adapter';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthUserAggregate> {
    const { dto } = command;

    const candidate = await this.repository.findOneByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(dto.password, 7);

    const createdUser = UserAggregate.create({
      ...dto,
      password: hashPassword,
    });

    const savedUser = await this.repository.save(createdUser);

    const { accessTokenValueObject, refreshTokenValueObject } =
      await this.tokenAdapter.generateTokens({
        userId: savedUser.id,
        email: savedUser.email,
      });

    return AuthUserAggregate.create({
      user: savedUser,
      accessToken: accessTokenValueObject,
      refreshToken: refreshTokenValueObject,
    });
  }
}
