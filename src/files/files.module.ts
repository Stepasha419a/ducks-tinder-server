import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { FilesService } from './files.service';
import { Module } from '@nestjs/common';
import { FileCommandHandlers } from './commands';
import { FILE_COMMAND_HANDLERS } from './application-services/commands';
import { FileFacade } from './application-services';
import { fileFacadeFactory } from './providers';

@Module({
  providers: [
    FilesService,
    ...FileCommandHandlers,
    ...FILE_COMMAND_HANDLERS,
    {
      provide: FileFacade,
      useFactory: fileFacadeFactory,
      inject: [CommandBus],
    },
  ],
  imports: [CqrsModule],
  exports: [FilesService],
})
export class FilesModule {}
