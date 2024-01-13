import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReturnUserCommand } from './return-user.command';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'user/domain/repository';
import { UserCheckValueObject } from 'user/domain/value-object';

@CommandHandler(ReturnUserCommand)
export class ReturnUserCommandHandler
  implements ICommandHandler<ReturnUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: ReturnUserCommand): Promise<UserCheckValueObject> {
    const { userId } = command;

    const userCheck = await this.repository.findUserNotPairCheck(userId);
    if (!userCheck) {
      throw new NotFoundException();
    }
    const place = await this.repository.findPlace(userId);
    if (!place) {
      throw new ForbiddenException();
    }

    await this.repository.deleteUserCheck(
      userCheck.checkedId,
      userCheck.wasCheckedId,
    );

    return userCheck;
  }
}
