import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveLastSeenCommand } from './save-last-seen.command';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatVisitEntity } from 'apps/chat/src/domain/entity';

@CommandHandler(SaveLastSeenCommand)
export class SaveLastSeenCommandHandler
  implements ICommandHandler<SaveLastSeenCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SaveLastSeenCommand): Promise<void> {
    const { userId, chatId } = command;

    const chatVisit = ChatVisitEntity.create({
      userId,
      chatId,
    });

    await this.repository.saveChatVisit(chatVisit);
  }
}
