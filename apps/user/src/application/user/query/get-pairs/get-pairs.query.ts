import { PairsFilterDto } from 'apps/user/src/domain/user/repository';

export class GetPairsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PairsFilterDto,
  ) {}
}
