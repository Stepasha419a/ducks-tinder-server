import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMatchQuery } from './get-match.query';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { MapUtil } from '@app/common/shared/util';

@QueryHandler(GetMatchQuery)
export class GetMatchQueryHandler implements IQueryHandler<GetMatchQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetMatchQuery): Promise<UserAggregate> {
    const { userId, matchUserId } = query;

    if (matchUserId) {
      return this.getCertainMatchUser(userId, matchUserId);
    }

    const user = await this.repository.findOne(userId);

    const userDistance = user.usersOnlyInDistance ? user.distance : 150;

    const matchUser = await this.repository.findMatch(
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

    if (!matchUser) {
      throw new NotFoundException();
    }

    const distance = MapUtil.getDistanceFromLatLonInKm(
      user.place.latitude,
      user.place.longitude,
      matchUser.place.latitude,
      matchUser.place.longitude,
    );

    matchUser.setDistance(distance);

    return matchUser;
  }

  private async getCertainMatchUser(
    userId: string,
    matchUserId: string,
  ): Promise<UserAggregate> {
    const matchUser = await this.repository.findOne(matchUserId);
    if (!matchUser) {
      throw new NotFoundException();
    }

    const place = await this.repository.findPlace(userId);
    const distance = MapUtil.getDistanceFromLatLonInKm(
      place.latitude,
      place.longitude,
      matchUser.place.latitude,
      matchUser.place.longitude,
    );

    matchUser.setDistance(distance);

    return matchUser;
  }
}
