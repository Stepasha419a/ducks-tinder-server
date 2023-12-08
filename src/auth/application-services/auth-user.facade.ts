import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  LoginCommand,
  LoginUserDto,
  LogoutCommand,
  RegisterCommand,
  RegisterUserDto,
} from './commands';
import { AuthUserAggregate } from 'auth/domain';

@Injectable()
export class AuthUserFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    register: (dto: RegisterUserDto) => this.register(dto),
    login: (dto: LoginUserDto) => this.login(dto),
    logout: (refreshTokenValue: string) => this.logout(refreshTokenValue),
  };
  queries = {};

  private register(dto: RegisterUserDto) {
    return this.commandBus.execute<RegisterCommand, AuthUserAggregate>(
      new RegisterCommand(dto),
    );
  }

  private login(dto: LoginUserDto) {
    return this.commandBus.execute<LoginCommand, AuthUserAggregate>(
      new LoginCommand(dto),
    );
  }

  private logout(refreshTokenValue: string) {
    return this.commandBus.execute<LogoutCommand>(
      new LogoutCommand(refreshTokenValue),
    );
  }
}
