import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeUserCommand } from './like-user.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { UserAggregate } from 'src/domain/user';

@CommandHandler(LikeUserCommand)
export class LikeUserCommandHandler
  implements ICommandHandler<LikeUserCommand, UserAggregate>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: LikeUserCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    if (userId === pairId) {
      throw new BadRequestException(ERROR.CAN_NOT_LIKE_YOURSELF);
    }

    const userPair = await this.repository.findOne(pairId);
    if (!userPair) {
      throw new NotFoundException();
    }

    const checkedUsersIds = await this.repository.findCheckedUserIds(
      userId,
      pairId,
    );

    const isSomeonePairForAnotherOne = checkedUsersIds.find(
      (checkedUserId) => checkedUserId == userId || checkedUserId == pairId,
    );

    if (isSomeonePairForAnotherOne) {
      throw new BadRequestException(ERROR.USER_ALREADY_CHECKED);
    }

    const place = await this.repository.findPlace(userId);

    if (!place || !userPair.place) {
      throw new BadRequestException(ERROR.NULL_PLACE);
    }

    userPair.setDistanceBetweenPlaces(place);

    await this.repository.createPair(userId, pairId);
    await this.repository.makeChecked(pairId, userId);

    return userPair;
  }
}
