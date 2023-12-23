import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptPairCommand } from './accept-pair.command';
import { ChatsService } from 'chats/chats.service';
import { UserRepository } from 'users/providers';

@CommandHandler(AcceptPairCommand)
export class AcceptPairCommandHandler
  implements ICommandHandler<AcceptPairCommand>
{
  constructor(
    private readonly repository: UserRepository,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
  ) {}

  async execute(command: AcceptPairCommand): Promise<string> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    await this.repository.deletePair(pair.id, userId);

    await this.chatsService.createChat([userId, pair.id]);

    return pair.id;
  }
}
