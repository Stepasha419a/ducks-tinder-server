import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlockChatCommand } from './block-chat.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { ChatAggregate } from 'apps/chat/src/domain';

@CommandHandler(BlockChatCommand)
export class BlockChatCommandHandler
  implements ICommandHandler<BlockChatCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: BlockChatCommand): Promise<ChatAggregate> {
    const { userId, chatId } = command;

    const chat = await this.repository.findOneHavingMember(chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }
    if (chat.blocked) {
      throw new BadRequestException();
    }

    await chat.blockChat(userId);
    await this.repository.save(chat);

    return chat;
  }
}
