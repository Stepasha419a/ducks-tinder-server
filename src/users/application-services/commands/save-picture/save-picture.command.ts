import { ICommand } from '@nestjs/cqrs';

export class SavePictureCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly picture: Express.Multer.File,
  ) {}
}
