import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { UserRepository } from 'user-service/src/domain/user/repository';
import { ClientProxy } from '@nestjs/microservices';
import { ChatServiceEvent, SERVICES } from '@app/common/shared/constant';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(SERVICES.CHAT) private readonly chatClient: ClientProxy,
  ) {}

  async execute(command: AcceptPairCommand): Promise<string> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    this.chatClient.emit(ChatServiceEvent.CreateChat, [userId, pairId]);

    await this.repository.deletePair(pair.id, userId);

    return pair.id;
  }
}
