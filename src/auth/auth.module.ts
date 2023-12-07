import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { TokensModule } from 'tokens/tokens.module';
import { UsersModule } from 'users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthCommandHandlers } from './legacy/commands';
import { AuthUserFacade } from './application-services';
import { authUserFacadeFactory } from './providers';
import { AUTH_USER_COMMAND_HANDLERS } from './application-services/commands';

@Module({
  providers: [
    ...AuthCommandHandlers,
    ...AUTH_USER_COMMAND_HANDLERS,
    {
      provide: AuthUserFacade,
      inject: [CommandBus],
      useFactory: authUserFacadeFactory,
    },
  ],
  controllers: [AuthController],
  imports: [CqrsModule, UsersModule, TokensModule],
})
export class AuthModule {}
