import { Module } from '@nestjs/common';
import { AUTH_COMMAND_HANDLERS } from '../../application/auth/command';
import { AuthMapper } from './mapper';
import { AuthFacade } from '../../application/auth';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { authFacadeFactory } from './facade';
import { AuthController } from '../../interface/auth';
import { UserModule } from '../user/user.module';
import { DomainModule } from 'src/domain';
import { TokenRepository } from 'src/domain/token/repository';
import { TokenAdapter } from './repository';
import { DatabaseModule } from '../database';
import { TokenController } from 'src/interface/token';

@Module({
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    AuthMapper,
    {
      provide: AuthFacade,
      inject: [CommandBus],
      useFactory: authFacadeFactory,
    },
    {
      provide: TokenRepository,
      useClass: TokenAdapter,
    },
  ],
  controllers: [AuthController, TokenController],
  imports: [CqrsModule, UserModule, DomainModule, DatabaseModule],
})
export class AuthModule {}
