import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from 'user/user.module';
import { AuthModule } from 'auth/auth.module';
import { TokensModule } from 'tokens/tokens.module';
import { ChatModule } from 'chat/chat.module';
import { PrismaModule } from 'prisma/prisma.module';
import { resolve } from 'path';
import { AccessTokenGuard } from 'common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(resolve(__dirname, '..', 'static')),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    TokensModule,
    ChatModule,
  ],
  providers: [
    { provide: APP_GUARD, useExisting: AccessTokenGuard },
    AccessTokenGuard,
  ],
})
export class AppModule {}
