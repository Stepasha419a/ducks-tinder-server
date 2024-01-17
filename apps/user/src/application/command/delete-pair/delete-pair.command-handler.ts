import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePairCommand } from './delete-pair.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'apps/user/src/domain/repository';

@CommandHandler(DeletePairCommand)
export class DeletePairCommandHandler
  implements ICommandHandler<DeletePairCommand>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(command: DeletePairCommand): Promise<string> {
    const { userId, pairId } = command;

    const pair = await this.repository.findPair(pairId, userId);
    if (!pair) {
      throw new NotFoundException();
    }

    await this.repository.deletePair(pair.id, userId);

    return pair.id;
  }
}
