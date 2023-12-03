import { NotValidatedUserDto } from 'users/legacy/dto';
import { MixPicturesDto } from 'users/legacy/dto';

export class MixPicturesCommand {
  constructor(
    public readonly user: NotValidatedUserDto,
    public readonly dto: MixPicturesDto,
  ) {}
}
