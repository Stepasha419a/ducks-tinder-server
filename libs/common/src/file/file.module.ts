import { Module } from '@nestjs/common';
import { FILE_COMMAND_HANDLERS, FileAdapter } from './adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  providers: [...FILE_COMMAND_HANDLERS, FileAdapter],
  imports: [
    CqrsModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', '..', 'static'),
    }),
  ],
  exports: [FileAdapter],
})
export class FileModule {}
