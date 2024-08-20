import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMatchQuery } from './get-match.query';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { User, UserAggregate } from 'src/domain/user';
import { ERROR } from 'src/infrastructure/user/common/constant';

@QueryHandler(GetMatchQuery)
export class GetMatchQueryHandler implements IQueryHandler<GetMatchQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetMatchQuery): Promise<UserAggregate> {
    const { userId } = query;

    const user = await this.repository.findOne(userId);

    if (!this.validateUserFields(user)) {
      throw new BadRequestException(ERROR.VALIDATION_FAILED);
    }

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

    matchUser.setDistanceBetweenPlaces(user.place);

    return matchUser;
  }

  private validateUserFields(user: User): boolean {
    if (
      !user.place ||
      !user.distance ||
      !user.preferAgeFrom ||
      !user.preferAgeTo ||
      !user.age ||
      !user.preferSex ||
      !user.sex
    ) {
      return false;
    }
    return true;
  }
}
