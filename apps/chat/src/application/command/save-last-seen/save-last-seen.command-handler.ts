import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveLastSeenCommand } from './save-last-seen.command';
import { ChatRepository } from 'chat/domain/repository';
import { ChatVisitValueObject } from 'chat/domain/value-object';

@CommandHandler(SaveLastSeenCommand)
export class SaveLastSeenCommandHandler
  implements ICommandHandler<SaveLastSeenCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SaveLastSeenCommand): Promise<void> {
    const { userId, chatId } = command;

    const chatVisit = ChatVisitValueObject.create({ userId, chatId });

    await this.repository.saveChatVisit(chatVisit);
  }
}
