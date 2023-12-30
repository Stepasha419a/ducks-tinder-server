import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DislikeUserCommand } from './dislike-user.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CAN_NOT_DISLIKE_YOURSELF,
  USER_ALREADY_CHECKED,
} from 'common/constants/error';
import { UserRepository } from 'user/application/repository';

@CommandHandler(DislikeUserCommand)
export class DislikeUserCommandHandler
  implements ICommandHandler<DislikeUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: DislikeUserCommand): Promise<void> {
    const { userId, pairId } = command;

    if (userId === pairId) {
      throw new BadRequestException(CAN_NOT_DISLIKE_YOURSELF);
    }

    const userPair = await this.repository.findOne(pairId);
    if (!userPair) {
      throw new NotFoundException();
    }

    const checkedUserIds = await this.repository.findCheckedUserIds(
      userId,
      pairId,
    );
    const isSomeonePairForAnotherOne = checkedUserIds.find(
      (checkedUserId) => checkedUserId === pairId,
    );

    if (isSomeonePairForAnotherOne) {
      throw new BadRequestException(USER_ALREADY_CHECKED);
    }

    await this.repository.makeChecked(pairId, userId);
  }
}
