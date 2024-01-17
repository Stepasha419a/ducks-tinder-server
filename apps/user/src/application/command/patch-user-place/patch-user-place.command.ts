import { PatchUserPlaceDto } from '../dto';

export class PatchUserPlaceCommand {
  constructor(
    public readonly userId: string,
    public readonly dto: PatchUserPlaceDto,
  ) {}
}
