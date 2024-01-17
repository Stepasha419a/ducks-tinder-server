import { MixPicturesDto } from 'apps/user/src/application/command/dto';

export class MixPicturesCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: MixPicturesDto,
  ) {}
}
