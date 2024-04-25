import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSortedQuery } from './get-sorted.query';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserAggregate } from 'apps/user/src/domain/user';
import { MapUtil } from '@app/common/shared/util';

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

    const sortedUser = await this.repository.findSorted(
      userId,
      user.place.latitude,
      user.place.longitude,
      userDistance,
      user.preferAgeFrom,
      user.preferAgeTo,
      user.age,
      user.preferSex,
      user.sex,
    );

    if (!sortedUser) {
      throw new NotFoundException();
    }

    const distance = MapUtil.getDistanceFromLatLonInKm(
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
    const distance = MapUtil.getDistanceFromLatLonInKm(
      place.latitude,
      place.longitude,
      sortedUser.place.latitude,
      sortedUser.place.longitude,
    );

    sortedUser.setDistance(distance);

    return sortedUser;
  }
}
