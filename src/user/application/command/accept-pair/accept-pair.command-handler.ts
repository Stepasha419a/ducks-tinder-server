import { NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { UserRepository } from 'user/application/repository';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AcceptPairCommand): Promise<string> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    const user = this.eventPublisher.mergeObjectContext(
      await this.repository.findOne(userId),
    );

    await this.repository.deletePair(pair.id, userId);

    user.acceptPair(pairId);
    user.commit();

    return pair.id;
  }
}
