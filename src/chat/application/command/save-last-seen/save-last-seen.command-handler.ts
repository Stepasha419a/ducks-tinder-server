import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveLastSeenCommand } from './save-last-seen.command';
import { ChatRepository } from 'chat/application/repository';
import { ChatVisitAggregate } from 'chat/domain';

@CommandHandler(SaveLastSeenCommand)
export class SaveLastSeenCommandHandler
  implements ICommandHandler<SaveLastSeenCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SaveLastSeenCommand): Promise<void> {
    const { userId, chatId } = command;

    const chatVisit = ChatVisitAggregate.create({ userId, chatId });

    await this.repository.saveChatVisit(chatVisit);
  }
}
