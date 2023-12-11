import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSortedQuery } from './get-sorted.query';
import { NotFoundException } from '@nestjs/common';
import { getDistanceFromLatLonInKm, getSearchingCoords } from 'common/helpers';
import { UserRepository } from 'users/providers';
import { ShortUserWithDistance } from 'users/domain';

@QueryHandler(GetSortedQuery)
export class GetSortedQueryHandler implements IQueryHandler<GetSortedQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetSortedQuery): Promise<ShortUserWithDistance> {
    const { userId } = query;

    const user = await this.repository.findOne(userId);

    const userDistance = user.usersOnlyInDistance ? user.distance : 150;
    const { maxLatitude, minLatitude, maxLongitude, minLongitude } =
      getSearchingCoords(
        user.place?.latitude,
        user.place?.longitude,
        userDistance,
      );

    const sortedUser = await this.repository.findSorted(
      userId,
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      user.preferAgeFrom,
      user.preferAgeTo,
      user.age,
      user.preferSex,
      user.sex,
    );

    if (!sortedUser) {
      throw new NotFoundException();
    }

    const distance = getDistanceFromLatLonInKm(
      user.place.latitude,
      user.place.longitude,
      sortedUser.place.latitude,
      sortedUser.place.longitude,
    );

    sortedUser.setDistance(distance);

    return sortedUser.getShortUserWithDistance();
  }
}
