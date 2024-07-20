import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPairsQuery } from './get-pairs.query';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { BadRequestException } from '@nestjs/common';
import { ERROR } from 'src/infrastructure/user/common/constant';

@QueryHandler(GetPairsQuery)
export class GetPairsQueryHandler implements IQueryHandler<GetPairsQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetPairsQuery): Promise<UserAggregate[]> {
    const { userId, dto } = query;

    const pairs = await this.repository.findPairs(userId, dto).catch(() => {
      throw new BadRequestException(ERROR.NULL_PLACE);
    });

    return pairs;
  }
}
