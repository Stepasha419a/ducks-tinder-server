import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { UserRepository } from 'src/domain/user/repository';
import { UserAggregate } from 'src/domain/user';
import { ChatApi } from '../../adapter';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly chatApi: ChatApi,
  ) {}

  async execute(command: AcceptPairCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    const place = await this.repository.findPlace(userId);

    pair.setDistanceBetweenPlaces(place);

    await this.chatApi.createChat({ memberIds: [userId, pairId] });

    await this.repository.deletePair(pair.id, userId);

    return pair;
  }
}
