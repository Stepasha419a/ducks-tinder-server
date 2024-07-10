import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { UserRepository } from 'src/domain/user/repository';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE, ChatServiceEvent } from 'src/infrastructure/rabbitmq/service';
import { ERROR } from 'src/infrastructure/user/common/constant';
import { UserAggregate } from 'src/domain/user';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(SERVICE.CHAT) private readonly chatClient: ClientProxy,
  ) {}

  async execute(command: AcceptPairCommand): Promise<UserAggregate> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    const place = await this.repository.findPlace(userId);

    if (!place || !pair.place) {
      throw new BadRequestException(ERROR.NULL_PLACE);
    }

    pair.setDistanceBetweenPlaces(place);

    this.chatClient.emit(ChatServiceEvent.CreateChat, [userId, pairId]);

    await this.repository.deletePair(pair.id, userId);

    return pair;
  }
}
