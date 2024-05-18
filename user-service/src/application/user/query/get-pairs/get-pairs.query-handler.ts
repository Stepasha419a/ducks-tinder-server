import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPairsQuery } from './get-pairs.query';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';

@QueryHandler(GetPairsQuery)
export class GetPairsQueryHandler implements IQueryHandler<GetPairsQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetPairsQuery): Promise<UserAggregate[]> {
    const { userId, dto } = query;

    const pairs = await this.repository.findPairs(userId, dto);

    return pairs;
  }
}
