import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { AUTH_COMMAND_HANDLERS } from './application/command';
import { AuthFacade } from './application';
import { authFacadeFactory } from './infrastructure/facade';
import { UserModule } from 'apps/user/src/user.module';
import { TokenAdapter } from './application/adapter/token';
import { TokenAdapterImplementation } from './infrastructure/adapter';
import { TOKEN_COMMAND_HANDLERS } from './infrastructure/adapter/token';
import { RefreshTokenRepository } from './domain/repository';
import { RefreshTokenAdapter } from './infrastructure/repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthMapper } from './infrastructure/mapper';

@Module({
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    ...TOKEN_COMMAND_HANDLERS,
    AuthMapper,
    {
      provide: AuthFacade,
      inject: [CommandBus],
      useFactory: authFacadeFactory,
    },
    {
      provide: TokenAdapter,
      useClass: TokenAdapterImplementation,
    },
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenAdapter,
    },
  ],
  controllers: [AuthController],
  imports: [CqrsModule, JwtModule, PrismaModule, UserModule],
  exports: [TokenAdapter],
})
export class AuthModule {}
