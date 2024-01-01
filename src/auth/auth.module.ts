import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { UserModule } from 'user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthUserFacade } from './application-services';
import { authUserFacadeFactory } from './providers';
import { AUTH_USER_COMMAND_HANDLERS } from './application-services/commands';

@Module({
  providers: [
    ...AUTH_USER_COMMAND_HANDLERS,
    {
      provide: AuthUserFacade,
      inject: [CommandBus],
      useFactory: authUserFacadeFactory,
    },
  ],
  controllers: [AuthController],
  imports: [CqrsModule, UserModule],
})
export class AuthModule {}
