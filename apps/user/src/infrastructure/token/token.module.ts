import { Module } from '@nestjs/common';
import { TOKEN_COMMAND_HANDLERS } from '../../application/token/command';
import { TOKEN_QUERY_HANDLERS } from '../../application/token/query';
import { TokenRepository } from '../../domain/token/repository';
import { TokenAdapter } from './repository';
import { TokenFacade } from '../../application/token';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { tokenFacadeFactory } from './facade';
import { TokenController } from '../../interface/token';
import { DatabaseModule } from '@app/common/database';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    ...TOKEN_COMMAND_HANDLERS,
    ...TOKEN_QUERY_HANDLERS,
    {
      provide: TokenRepository,
      useClass: TokenAdapter,
    },
    {
      provide: TokenFacade,
      inject: [CommandBus, QueryBus],
      useFactory: tokenFacadeFactory,
    },
  ],
  controllers: [TokenController],
  imports: [DatabaseModule, JwtModule, CqrsModule],
  exports: [TokenFacade],
})
export class TokenModule {}
