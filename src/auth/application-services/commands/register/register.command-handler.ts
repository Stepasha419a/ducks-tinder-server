import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { USER_ALREADY_EXISTS } from 'common/constants/error';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserService } from 'user/interface';
import { AuthUserAggregate } from 'auth/domain/auth-user.aggregate';
import { TokensService } from 'tokens/tokens.service';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: TokensService,
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
