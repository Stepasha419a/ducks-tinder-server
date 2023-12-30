import { MixPicturesDto } from 'user/application/command/dto';

export class MixPicturesCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: MixPicturesDto,
  ) {}
}
