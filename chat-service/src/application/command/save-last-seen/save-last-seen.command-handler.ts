import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveLastSeenCommand } from './save-last-seen.command';
import { ChatRepository } from 'chat-service/src/domain/repository';
import { UserChatConnectionEntity } from 'chat-service/src/domain/entity';

@CommandHandler(SaveLastSeenCommand)
export class SaveLastSeenCommandHandler
  implements ICommandHandler<SaveLastSeenCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SaveLastSeenCommand): Promise<void> {
    const { userId, chatId } = command;

    const userChatConnection = UserChatConnectionEntity.create({
      userId,
      chatId,
    });

    await this.repository.saveUserChatConnection(userChatConnection);
  }
}
