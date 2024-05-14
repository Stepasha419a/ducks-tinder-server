import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReturnUserCommand } from './return-user.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'user-service/src/domain/user/repository';
import { UserCheckEntity } from 'user-service/src/domain/user/entity';

@CommandHandler(ReturnUserCommand)
export class ReturnUserCommandHandler
  implements ICommandHandler<ReturnUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: ReturnUserCommand): Promise<UserCheckEntity> {
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
