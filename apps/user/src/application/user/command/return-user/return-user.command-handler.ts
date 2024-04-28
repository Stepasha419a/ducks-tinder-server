import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReturnUserCommand } from './return-user.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'apps/user/src/domain/user/repository';
import { UserCheckAggregate } from 'apps/user/src/domain/user/aggregate';

@CommandHandler(ReturnUserCommand)
export class ReturnUserCommandHandler
  implements ICommandHandler<ReturnUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: ReturnUserCommand): Promise<UserCheckAggregate> {
    const { userId } = command;

    const userCheck = await this.repository.findUserNotPairCheck(userId);
    if (!userCheck) {
      throw new NotFoundException();
    }

    await this.repository.deleteUserCheck(
      userCheck.checkedId,
      userCheck.wasCheckedId,
    );

    return userCheck;
  }
}
