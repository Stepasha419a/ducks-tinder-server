import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { TokenHandlers } from './legacy/commands';
import { TOKEN_COMMAND_HANDLERS } from './application-services/commands';
import { RefreshTokenFacade } from './application-services';
import { refreshTokenFacadeFactory } from './providers/refresh-token-facade.factory';
import { RefreshTokenAdapter, RefreshTokenRepository } from './providers';

@Module({
  providers: [
    TokensService,
    ...TokenHandlers,
    ...TOKEN_COMMAND_HANDLERS,
    {
      provide: RefreshTokenFacade,
      inject: [CommandBus, QueryBus],
      useFactory: refreshTokenFacadeFactory,
    },
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenAdapter,
    },
  ],
  imports: [PrismaModule, CqrsModule, JwtModule.register({})],
  exports: [TokensService],
})
export class TokensModule {}
