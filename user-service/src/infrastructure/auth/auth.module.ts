import { Module } from '@nestjs/common';
import { AUTH_COMMAND_HANDLERS } from '../../application/auth/command';
import { AuthMapper } from './mapper';
import { AuthFacade } from '../../application/auth';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { authFacadeFactory } from './facade';
import { AuthController } from '../../interface/auth';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { DomainModule } from 'src/domain';
import { TokenRepository } from 'src/domain/token/repository';
import { TokenAdapter } from '../token/repository';
import { DatabaseModule } from '../database';

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
  controllers: [AuthController],
  imports: [
    CqrsModule,
    TokenModule,
    UserModule,
    JwtModule,
    DomainModule,
    DatabaseModule,
  ],
})
export class AuthModule {}
