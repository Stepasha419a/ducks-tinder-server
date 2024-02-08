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
import { AuthUserAggregate } from 'apps/user/src/domain/auth';
import { TokenAdapter } from './adapter/token';

@Injectable()
export class AuthFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly tokenAdapter: TokenAdapter,
  ) {}

  commands = {
    register: (dto: RegisterUserDto) => this.register(dto),
    login: (dto: LoginUserDto) => this.login(dto),
    logout: (refreshTokenValue: string) => this.logout(refreshTokenValue),
    refresh: (refreshTokenValue: string) => this.refresh(refreshTokenValue),
  };
  queries = {
    validateAccessToken: (accessTokenValue: string) =>
      this.validateAccessToken(accessTokenValue),
    validateRefreshToken: (refreshTokenValue: string) =>
      this.validateRefreshToken(refreshTokenValue),
  };

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

  private refresh(refreshTokenValue: string) {
    return this.commandBus.execute<RefreshCommand, AuthUserAggregate>(
      new RefreshCommand(refreshTokenValue),
    );
  }

  private validateAccessToken(accessTokenValue: string) {
    return this.tokenAdapter.validateAccessToken(accessTokenValue);
  }

  private validateRefreshToken(refreshTokenValue: string) {
    return this.tokenAdapter.validateRefreshToken(refreshTokenValue);
  }
}
