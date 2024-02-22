import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeletePictureCommand, SavePictureCommand } from './command';

@Injectable()
export class FileAdapter {
  constructor(private readonly commandBus: CommandBus) {}

  savePicture(file: Express.Multer.File, userId: string): Promise<string> {
    return this.commandBus.execute<SavePictureCommand, string>(
      new SavePictureCommand(file, userId),
    );
  }

  deletePicture(fileName: string, userId: string): Promise<string> {
    return this.commandBus.execute<DeletePictureCommand, string>(
      new DeletePictureCommand(fileName, userId),
    );
  }
}
