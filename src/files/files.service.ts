import { Injectable } from '@nestjs/common';
import { FileFacade } from './application-services';

@Injectable()
export class FilesService {
  constructor(private readonly facade: FileFacade) {}

  savePicture(file: Express.Multer.File, userId: string): Promise<string> {
    return this.facade.commands.savePicture(file, userId);
  }

  deletePicture(fileName: string, userId: string): Promise<string> {
    return this.facade.commands.deletePicture(fileName, userId);
  }
}
