import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { ChatRepository } from 'chats/providers';
import { MessageAggregate } from 'chats/domain';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(private readonly repository: ChatRepository) {}

  async execute(command: SendMessageCommand): Promise<MessageAggregate> {
    const { userId, dto } = command;

    const chat = await this.repository.findOneHavingMember(dto.chatId, userId);
    if (!chat) {
      throw new NotFoundException();
    }
    if (chat.blocked) {
      throw new ForbiddenException();
    }

    const replied = dto.repliedId
      ? await this.repository.findMessage(dto.repliedId)
      : undefined;
    if (dto.repliedId && !replied) {
      throw new NotFoundException();
    }

    const message = MessageAggregate.create({
      chatId: chat.id,
      replied: replied && {
        id: replied.id,
        text: replied.text,
        userId: replied.userId,
      },
      text: dto.text,
      userId,
    });
    await this.repository.saveMessage(message);

    return message;
  }
}
