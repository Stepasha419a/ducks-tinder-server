import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from 'user/user.module';
import { FilesModule } from 'files/files.module';
import { AuthModule } from 'auth/auth.module';
import { TokensModule } from 'tokens/tokens.module';
import { ChatsModule } from 'chats/chats.module';
import { PrismaModule } from 'prisma/prisma.module';
import * as path from 'path';
import { AccessTokenGuard } from 'common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(path.resolve(__dirname, '..', 'static')),
    }),
    PrismaModule,
    UserModule,
    FilesModule,
    AuthModule,
    TokensModule,
    ChatsModule,
  ],
  providers: [
    { provide: APP_GUARD, useExisting: AccessTokenGuard },
    AccessTokenGuard,
  ],
})
export class AppModule {}
