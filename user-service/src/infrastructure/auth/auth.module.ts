import { Module } from '@nestjs/common';
import { AUTH_COMMAND_HANDLERS } from '../../application/auth/command';
import { AuthMapper } from './mapper';
import { AuthFacade } from '../../application/auth';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { authFacadeFactory } from './facade';
import { AuthController } from '../../interface/auth';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';

@Module({
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    AuthMapper,
    {
      provide: AuthFacade,
      inject: [CommandBus],
      useFactory: authFacadeFactory,
    },
  ],
  controllers: [AuthController],
  imports: [CqrsModule, TokenModule, UserModule],
})
export class AuthModule {}
