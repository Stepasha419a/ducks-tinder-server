import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { randomUUID } from 'crypto';
import { UserAggregate } from 'src/domain/user';
import { UserRepository } from 'src/domain/user/repository';
import { AuthUserView } from '../../view';
import { COMMON_ERROR } from 'src/application/common';
import { JwtService } from 'src/domain/service/jwt';
import { TokenRepository } from 'src/domain/token/repository';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(command: RegisterCommand): Promise<AuthUserView> {
    const { dto } = command;

    const candidate = await this.userRepository.findOneByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException(COMMON_ERROR.USER_ALREADY_EXISTS);
    }

    const hashPassword = await bcrypt.hash(dto.password, 7);

    const activationLink = randomUUID();

    const user = UserAggregate.create({
      ...dto,
      activationLink,
      password: hashPassword,
    });

    const savedUser = await this.userRepository.save(user).catch((err) => {
      throw new BadRequestException(err);
    });

    const { accessToken, refreshToken } =
      await this.jwtService.generateUserTokens(user.id);

    await this.tokenRepository.saveRefreshToken(refreshToken);

    return {
      ...savedUser,
      accessToken,
      refreshToken,
    };
  }
}
