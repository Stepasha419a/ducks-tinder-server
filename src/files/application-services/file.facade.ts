import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePictureCommand, SavePictureCommand } from './commands';

@Injectable()
export class FileFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    savePicture: (file: Express.Multer.File, userId: string) =>
      this.savePicture(file, userId),
    deletePicture: (fileName: string, userId: string) =>
      this.deletePicture(fileName, userId),
  };

  private savePicture(file: Express.Multer.File, userId: string) {
    return this.commandBus.execute<SavePictureCommand, string>(
      new SavePictureCommand(file, userId),
    );
  }

  private deletePicture(fileName: string, userId: string) {
    return this.commandBus.execute<DeletePictureCommand, string>(
      new DeletePictureCommand(fileName, userId),
    );
  }
}
