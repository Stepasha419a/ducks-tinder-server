import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { DeleteChatCommand } from './delete-chat.command';
import { ChatRepository } from 'chat/application/repository';
import { ChatAggregate } from 'chat/domain';

@CommandHandler(DeleteChatCommand)
export class DeleteChatCommandHandler
  implements ICommandHandler<DeleteChatCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: DeleteChatCommand): Promise<ChatAggregate> {
    const { userId, chatId } = command;

    const chat = await this.repository.findOneHavingMember(chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }

    await this.repository.delete(chat.id);

    return chat;
  }
}
