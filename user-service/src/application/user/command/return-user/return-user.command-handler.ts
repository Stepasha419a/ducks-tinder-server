import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReturnUserCommand } from './return-user.command';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

    const deleted = await this.repository.deleteLastReturnable(userId);
    if (!deleted) {
      throw new InternalServerErrorException();
    }

    const place = await this.repository.findPlace(userId);

    returnedUser.setDistanceBetweenPlaces(place);

    return returnedUser;
  }
}
