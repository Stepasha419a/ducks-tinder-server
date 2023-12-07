import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand, RegisterUserDto } from './commands';
import { AuthUserAggregate } from 'auth/domain';

@Injectable()
export class AuthUserFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    register: (dto: RegisterUserDto) => this.register(dto),
  };
  queries = {};

  private register(dto: RegisterUserDto) {
    return this.commandBus.execute<RegisterCommand, AuthUserAggregate>(
      new RegisterCommand(dto),
    );
  }
}
