import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensService } from 'tokens/tokens.service';
import { UsersService } from 'users/users.service';
import { AuthDataReturn } from 'auth/auth.interface';
import { UserTokenDto } from 'auth/dto';
import { RegisterCommand } from './register.command';
import { USER_ALREADY_EXISTS } from 'common/constants/error';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthDataReturn> {
    const { dto } = command;

    const candidate = await this.usersService.getUserByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(dto.password, 7);

    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    });

    const userTokenDto = new UserTokenDto({ id: user.id, email: user.email });
    const tokens = await this.tokensService.generateTokens({ ...userTokenDto });

    return {
      data: { user, accessToken: tokens.accessToken },
      refreshToken: tokens.refreshToken,
    };
  }
}
