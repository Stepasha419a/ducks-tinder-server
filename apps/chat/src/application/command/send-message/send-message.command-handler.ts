import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { ChatRepository } from 'apps/chat/src/domain/repository';
import { MessageAggregate } from 'apps/chat/src/domain';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(
    private readonly repository: ChatRepository,
    private readonly publisher: EventPublisher,
  ) {}

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
        name: replied.name,
        text: replied.text,
        userId: replied.userId,
      },
      text: dto.text,
      userId,
    });

    await this.repository.increaseChatVisits(chat.id, userId, 1);

    const savedMessage = await this.repository.saveMessage(message);

    return savedMessage;
  }
}
