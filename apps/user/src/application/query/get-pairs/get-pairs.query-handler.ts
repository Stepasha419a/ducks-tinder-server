import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPairsQuery } from './get-pairs.query';
import { getDistanceFromLatLonInKm } from '@app/common/helpers';
import { UserRepository } from 'apps/user/src/domain/repository';
import { UserAggregate } from 'apps/user/src/domain';

@QueryHandler(GetPairsQuery)
export class GetPairsQueryHandler implements IQueryHandler<GetPairsQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetPairsQuery): Promise<UserAggregate[]> {
    const { userId } = query;

    const user = await this.repository.findOne(userId);

    const pairs = await this.repository.findPairs(userId);

    const pairsWithDistance = pairs.map((pair) => {
      const distance = getDistanceFromLatLonInKm(
        user.place.latitude,
        user.place.longitude,
        pair.place?.latitude,
        pair.place?.longitude,
      );
      pair.setDistance(distance);

      return pair;
    });

    return pairsWithDistance;
  }
}
