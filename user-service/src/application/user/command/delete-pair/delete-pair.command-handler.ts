import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePairCommand } from './delete-pair.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';

@CommandHandler(DeletePairCommand)
export class DeletePairCommandHandler
  implements ICommandHandler<DeletePairCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: DeletePairCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    const place = await this.repository.findPlace(userId);

    pair.setDistanceBetweenPlaces(place);

    await this.repository.deletePair(pair.id, userId);

    return pair;
  }
}
