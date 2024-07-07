import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblockChatCommand } from './unblock-chat.command';
import { ChatRepository } from 'src/domain/chat/repository';
import { ChatAggregate } from 'src/domain/chat';

@CommandHandler(UnblockChatCommand)
export class UnblockChatCommandHandler
  implements ICommandHandler<UnblockChatCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: UnblockChatCommand): Promise<ChatAggregate> {
    const { userId, chatId } = command;

    const chat = await this.repository.findOneHavingMember(chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }
    if (!chat.blocked) {
      throw new BadRequestException();
    }

    await chat.unblockChat();
    await this.repository.save(chat);

    return chat;
  }
}
