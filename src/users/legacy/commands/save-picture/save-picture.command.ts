import { ICommand } from '@nestjs/cqrs';
import { NotValidatedUserDto } from 'users/legacy/dto';

export class SavePictureCommand implements ICommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly picture: Express.Multer.File,
  ) {}
}
