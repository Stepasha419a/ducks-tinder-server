import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMatchQuery } from './get-match.query';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { User, UserAggregate } from 'src/domain/user';
import { ERROR } from 'src/infrastructure/user/common/constant';

@QueryHandler(GetMatchQuery)
export class GetMatchQueryHandler implements IQueryHandler<GetMatchQuery> {
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetMatchQuery): Promise<UserAggregate[]> {
    const { userId, dto } = query;

    const user = await this.repository.findOne(userId);

    if (!this.validateUserFields(user)) {
      throw new BadRequestException(ERROR.VALIDATION_FAILED);
    }

    const matchUsers = await this.repository.findMatch(user, dto);

    if (!matchUsers.length) {
      return matchUsers;
    }

    matchUsers.forEach((matchUser) => {
      matchUser.setDistanceBetweenPlaces(user.place);
    });

    return matchUsers;
  }

  private validateUserFields(user: User): boolean {
    if (
      !user?.place ||
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
