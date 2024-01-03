import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { USER_ALREADY_EXISTS } from 'common/constants/error';
import { UserService } from 'user/interface';
import { AuthUserAggregate } from 'user/domain/auth/auth-user.aggregate';
import { UserRepository } from 'user/application/repository';
import { UserAggregate } from 'user/domain';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly userService: UserService,
    private readonly repository: UserRepository,
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

    const { accessTokenAggregate, refreshTokenAggregate } =
      await this.userService.generateTokens({
        userId: savedUser.id,
        email: savedUser.email,
      });

    return AuthUserAggregate.create({
      user: savedUser,
      accessToken: accessTokenAggregate,
      refreshToken: refreshTokenAggregate,
    });
  }
}
