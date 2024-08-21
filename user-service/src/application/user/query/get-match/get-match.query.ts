import { MatchFilterDto } from 'src/domain/user/repository';

export class GetMatchQuery {
  constructor(
    public readonly userId: string,
    public readonly dto: MatchFilterDto,
  ) {}
}
