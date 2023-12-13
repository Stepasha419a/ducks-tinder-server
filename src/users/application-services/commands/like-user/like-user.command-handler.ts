import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeUserCommand } from './like-user.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CAN_NOT_LIKE_YOURSELF,
  USER_ALREADY_CHECKED,
} from 'common/constants/error';
import { UserRepository } from 'users/providers';

@CommandHandler(LikeUserCommand)
export class LikeUserCommandHandler
  implements ICommandHandler<LikeUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: LikeUserCommand): Promise<void> {
    const { userId, pairId } = command;

    if (userId === pairId) {
      throw new BadRequestException(CAN_NOT_LIKE_YOURSELF);
    }

    const userPair = await this.repository.findOne(pairId);
    if (!userPair) {
      throw new NotFoundException();
    }

    const checkedUsersIds = await this.repository.findCheckedUsersIds(
      userId,
      pairId,
    );

    const isSomeonePairForAnotherOne = checkedUsersIds.find(
      (checkedUserId) => checkedUserId == userId || checkedUserId == pairId,
    );

    if (isSomeonePairForAnotherOne) {
      throw new BadRequestException(USER_ALREADY_CHECKED);
    }

    await this.repository.createPair(userId, pairId);
  }
}
