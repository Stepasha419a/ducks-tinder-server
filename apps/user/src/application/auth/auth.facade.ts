import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  LoginCommand,
  LoginUserDto,
  LogoutCommand,
  RefreshCommand,
  RegisterCommand,
  RegisterUserDto,
} from './command';
import { AuthUserView } from './view';

@Injectable()
export class AuthFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    register: (dto: RegisterUserDto) => this.register(dto),
    login: (dto: LoginUserDto) => this.login(dto),
    logout: (refreshTokenValue: string) => this.logout(refreshTokenValue),
    refresh: (refreshTokenValue: string) => this.refresh(refreshTokenValue),
  };

  private register(dto: RegisterUserDto) {
    return this.commandBus.execute<RegisterCommand, AuthUserView>(
      new RegisterCommand(dto),
    );
  }

  private login(dto: LoginUserDto) {
    return this.commandBus.execute<LoginCommand, AuthUserView>(
      new LoginCommand(dto),
    );
  }

  private logout(refreshTokenValue: string) {
    return this.commandBus.execute<LogoutCommand>(
      new LogoutCommand(refreshTokenValue),
    );
  }

  private refresh(refreshTokenValue: string) {
    return this.commandBus.execute<RefreshCommand, AuthUserView>(
      new RefreshCommand(refreshTokenValue),
    );
  }
}
