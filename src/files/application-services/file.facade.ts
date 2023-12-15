import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SavePictureCommand } from './commands';

@Injectable()
export class FileFacade {
  constructor(private readonly commandBus: CommandBus) {}

  commands = {
    savePicture: (file: Express.Multer.File, userId: string) =>
      this.savePicture(file, userId),
  };

  private savePicture(file: Express.Multer.File, userId: string) {
    return this.commandBus.execute<SavePictureCommand, string>(
      new SavePictureCommand(file, userId),
    );
  }
}
