import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { ChatsService } from 'chats/chats.service';
import { UserRepository } from 'users/providers';
import { UserAggregate } from 'users/domain';
import { getDistanceFromLatLonInKm } from 'common/helpers';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
  ) {}

  async execute(command: AcceptPairCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    await this.repository.deletePair(pair.id, userId);

    await this.chatsService.createChat([userId, pair.id]);

    const user = await this.repository.findOne(userId);
    const distance = getDistanceFromLatLonInKm(
      user.place.latitude,
      user.place.longitude,
      pair.place?.latitude,
      pair.place?.longitude,
    );
    pair.setDistance(distance);

    return pair;
  }
}
