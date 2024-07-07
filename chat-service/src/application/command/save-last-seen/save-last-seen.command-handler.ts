import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveLastSeenCommand } from './save-last-seen.command';
import { ChatRepository } from 'src/domain/chat/repository';
import { UserChatConnectionEntity } from 'src/domain/chat/entity';

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
