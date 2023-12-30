import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSortedQuery } from './get-sorted.query';
import { NotFoundException } from '@nestjs/common';
import { getDistanceFromLatLonInKm, getSearchingCoords } from 'common/helpers';
import { UserRepository } from 'user/application/repository';
import { UserAggregate } from 'user/domain';

@QueryHandler(GetSortedQuery)
export class GetSortedQueryHandler implements IQueryHandler<GetSortedQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetSortedQuery): Promise<UserAggregate> {
    const { userId, sortedUserId } = query;

    if (sortedUserId) {
      return this.getCertainSortedUser(userId, sortedUserId);
    }

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

    return sortedUser;
  }

  private async getCertainSortedUser(
    userId: string,
    sortedUserId: string,
  ): Promise<UserAggregate> {
    const sortedUser = await this.repository.findOne(sortedUserId);
    if (!sortedUser) {
      throw new NotFoundException();
    }

    const place = await this.repository.findPlace(userId);
    const distance = getDistanceFromLatLonInKm(
      place.latitude,
      place.longitude,
      sortedUser.place.latitude,
      sortedUser.place.longitude,
    );

    sortedUser.setDistance(distance);

    return sortedUser;
  }
}
