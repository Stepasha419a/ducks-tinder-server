import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  LoginCommand,
  LoginUserDto,
  LogoutCommand,
  RefreshCommand,
  RegisterCommand,
  RegisterUserDto,
} from 'user/infrastructure/adapter/auth/command';
import { AuthUserAggregate } from 'user/domain/auth';
import { AuthAdapter } from 'user/application/adapter';

@Injectable()
export class AuthAdapterImplementation implements AuthAdapter {
  constructor(private readonly commandBus: CommandBus) {}

  register(dto: RegisterUserDto): Promise<AuthUserAggregate> {
    return this.commandBus.execute<RegisterCommand, AuthUserAggregate>(
      new RegisterCommand(dto),
    );
  }

  login(dto: LoginUserDto): Promise<AuthUserAggregate> {
    return this.commandBus.execute<LoginCommand, AuthUserAggregate>(
      new LoginCommand(dto),
    );
  }

  logout(refreshTokenValue: string): Promise<void> {
    return this.commandBus.execute<LogoutCommand>(
      new LogoutCommand(refreshTokenValue),
    );
  }

  refresh(refreshTokenValue: string): Promise<AuthUserAggregate> {
    return this.commandBus.execute<RefreshCommand, AuthUserAggregate>(
      new RefreshCommand(refreshTokenValue),
    );
  }
}
