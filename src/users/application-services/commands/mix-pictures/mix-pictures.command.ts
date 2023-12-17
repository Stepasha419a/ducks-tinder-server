import { MixPicturesDto } from 'users/application-services/commands/dto';

export class MixPicturesCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: MixPicturesDto,
  ) {}
}
