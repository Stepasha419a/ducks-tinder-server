import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePictureCommand } from './commands';
import { FileFacade } from './application-services';

@Injectable()
export class FilesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly facade: FileFacade,
  ) {}

  savePicture(file: Express.Multer.File, userId: string): Promise<string> {
    return this.facade.commands.savePicture(file, userId);
  }

  deletePicture(fileName: string, userId: string): Promise<string> {
    return this.commandBus.execute(new DeletePictureCommand(fileName, userId));
  }
}
