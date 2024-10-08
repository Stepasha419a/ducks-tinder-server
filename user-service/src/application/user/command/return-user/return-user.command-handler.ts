import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReturnUserCommand } from './return-user.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';

@CommandHandler(ReturnUserCommand)
export class ReturnUserCommandHandler
  implements ICommandHandler<ReturnUserCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: ReturnUserCommand): Promise<UserAggregate> {
    const { userId } = command;

    const returnedUser = await this.repository.findLastReturnableUser(userId);
    if (!returnedUser) {
      throw new NotFoundException();
    }

    await this.repository.deleteLastReturnable(userId);
    await this.repository.deleteUserCheck(returnedUser.id, userId);

    const place = await this.repository.findPlace(userId);

    returnedUser.setDistanceBetweenPlaces(place);

    return returnedUser;
  }
}
