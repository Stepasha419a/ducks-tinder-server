import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DislikeUserCommand } from './dislike-user.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { UserAggregate } from 'src/domain/user';
import { UserCheckEntity } from 'src/domain/user/entity';

@CommandHandler(DislikeUserCommand)
export class DislikeUserCommandHandler
  implements ICommandHandler<DislikeUserCommand, UserAggregate>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: DislikeUserCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    if (userId === pairId) {
      throw new BadRequestException(ERROR.CAN_NOT_DISLIKE_YOURSELF);
    }

    const userPair = await this.repository.findOne(pairId);
    if (!userPair) {
      throw new NotFoundException();
    }

    const userChecks = await this.repository.findUserChecksWithUser(
      userId,
      pairId,
    );
    if (userChecks.length > 0) {
      throw new BadRequestException(ERROR.USER_ALREADY_CHECKED);
    }

    const place = await this.repository.findPlace(userId);

    userPair.setDistanceBetweenPlaces(place);

    const userCheck = UserCheckEntity.create({
      checkedId: pairId,
      wasCheckedId: userId,
    });
    await this.repository.saveUserCheck(userCheck);
    await this.repository.saveLastReturnable(userId, userPair);

    return userPair;
  }
}
