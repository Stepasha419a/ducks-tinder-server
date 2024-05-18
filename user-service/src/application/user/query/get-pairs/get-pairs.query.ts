import { PairsFilterDto } from 'src/domain/user/repository';

export class GetPairsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PairsFilterDto,
  ) {}
}
