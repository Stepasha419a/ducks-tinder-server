import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPairsQuery } from './get-pairs.query';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { MapUtil } from '@app/common/shared/util';

@QueryHandler(GetPairsQuery)
export class GetPairsQueryHandler implements IQueryHandler<GetPairsQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetPairsQuery): Promise<UserAggregate[]> {
    const { userId, dto } = query;

    const user = await this.repository.findOne(userId);

    const pairs = await this.repository.findPairs(userId, dto);

    const pairsWithDistance = pairs.map((pair) => {
      const distance = MapUtil.getDistanceFromLatLonInKm(
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
