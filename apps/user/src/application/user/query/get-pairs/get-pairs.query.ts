import { PaginationDto } from '@app/common/shared/dto';

export class GetPairsQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: PaginationDto,
  ) {}
}
